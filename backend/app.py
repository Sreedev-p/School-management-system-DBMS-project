import os
import oracledb
from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from datetime import datetime, date

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20MB limit

# Initialize Oracle Thick Mode
try:
    client_dir = os.getenv("ORACLE_CLIENT_PATH", r"C:\oracle instant client\instantclient_23_26")
    oracledb.init_oracle_client(lib_dir=client_dir)
except Exception as e:
    print(f"Notice: Oracle client already initialized or running thin fallback: {e}")

pool = oracledb.create_pool(
    user=os.getenv("DB_USER", "school_admin"),
    password=os.getenv("DB_PASSWORD", "mypassword123"),
    dsn=os.getenv("DB_DSN", "localhost:1521/XE"),
    min=2, max=15, increment=1
)

def get_db():
    if 'db' not in g:
        g.db = pool.acquire()
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        pool.release(db)

def serialize_row(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        val = row[idx]
        if isinstance(val, (datetime, date)):
            val = val.strftime('%Y-%m-%d')
        d[col[0].lower()] = val
    return d

def query_all(sql, params=None):
    conn = get_db()
    with conn.cursor() as cur:
        cur.execute(sql, params or [])
        return [serialize_row(cur, r) for r in cur.fetchall()]

def query_one(sql, params=None):
    conn = get_db()
    with conn.cursor() as cur:
        cur.execute(sql, params or [])
        r = cur.fetchone()
        return serialize_row(cur, r) if r else None

# Static serving of local uploaded submission files
@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# -------------------------------------------------------------
# AUTHENTICATION
# -------------------------------------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    role = data.get('role', '').lower().strip()
    uid = data.get('id')
    pwd = data.get('password', '').strip()

    if not role or not uid or not pwd:
        return jsonify({"error": "Role, Registration ID, and Password are required."}), 400

    conn = get_db()
    with conn.cursor() as cur:
        if role == 'student':
            cur.execute("SELECT student_id, name, email, dept_id FROM student WHERE student_id = :1", [uid])
            row = cur.fetchone()
        elif role == 'faculty':
            cur.execute("SELECT faculty_id, name, email, dept_id FROM faculty WHERE faculty_id = :1", [uid])
            row = cur.fetchone()
        elif role == 'guardian':
            cur.execute("SELECT guardian_id, name, phone FROM guardian WHERE guardian_id = :1", [uid])
            row = cur.fetchone()
        else:
            return jsonify({"error": "Invalid role selected."}), 400

        if not row:
            return jsonify({"error": f"No account found with ID {uid} under role {role.capitalize()}."}), 404

        full_name = row[1]
        first_name = full_name.split()[0].lower()

        if pwd.lower() != first_name:
            return jsonify({"error": "Authentication failed. Incorrect password credentials."}), 401

        return jsonify({
            "id": row[0],
            "name": full_name,
            "email": row[2] if role != 'guardian' else f"Guardian ({row[2]})",
            "role": role,
            "dept_id": row[3] if role != 'guardian' else None
        })

# -------------------------------------------------------------
# STUDENT PORTAL ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/student/<int:sid>/full-view')
def student_full_view(sid):
    profile = query_one("""
        SELECT s.student_id, s.name, s.email, s.dob, s.national_id, s.dept_id, d.dept_name
        FROM student s
        JOIN department d ON s.dept_id = d.dept_id
        WHERE s.student_id = :1
    """, [sid])

    classes = query_all("""
        SELECT c.class_id, c.room_id, c.academic_year, f.name as teacher_name
        FROM enrolled_in e
        JOIN class c ON e.class_id = c.class_id
        LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
        WHERE e.student_id = :1
        ORDER BY c.class_id
    """, [sid])

    attendance = query_all("""
        SELECT a.class_id, a.attend_date, a.did_attend, c.room_id
        FROM attendance a
        JOIN class c ON a.class_id = c.class_id
        WHERE a.student_id = :1
        ORDER BY a.attend_date DESC
    """, [sid])

    marks = query_all("""
        SELECT m.subject_id, sub.name as subject_name, sub.credits, m.assessment_type, m.mark, m.max_mark
        FROM mark m
        JOIN subject sub ON m.subject_id = sub.subject_id
        WHERE m.student_id = :1
        ORDER BY sub.subject_id, m.assessment_type
    """, [sid])

    assignments = query_all("""
        SELECT a.assignment_id, a.title, a.due_date, a.class_id, sub.name as subject_name,
               s.submit_date, s.file_url
        FROM enrolled_in e
        JOIN assignment a ON e.class_id = a.class_id
        JOIN subject sub ON a.subject_id = sub.subject_id
        LEFT JOIN submission s ON s.assignment_id = a.assignment_id AND s.student_id = :1
        WHERE e.student_id = :1
        ORDER BY a.due_date DESC
    """, [sid])

    fees = query_all("SELECT * FROM fee_payment WHERE student_id = :1 ORDER BY pay_date DESC", [sid])
    events = query_all("""
        SELECT ev.event_id, ev.name, ev.event_date, ev.venue,
               CASE WHEN att.student_id IS NOT NULL THEN 'REGISTERED' ELSE 'OPEN' END as reg_status
        FROM event ev
        LEFT JOIN attends att ON ev.event_id = att.event_id AND att.student_id = :1
        ORDER BY ev.event_date DESC
    """, [sid])

    return jsonify({
        "profile": profile,
        "classes": classes,
        "attendance": attendance,
        "marks": marks,
        "assignments": assignments,
        "fees": fees,
        "events": events
    })

@app.route('/api/student/<int:sid>/upload-assignment', methods=['POST'])
def student_upload(sid):
    if 'file' not in request.files:
        return jsonify({"error": "Physical document payload not supplied."}), 400
    file = request.files['file']
    assignment_id = request.form.get('assignment_id')

    if not file or file.filename == '' or not assignment_id:
        return jsonify({"error": "Valid file and assignment ID required."}), 400

    filename = secure_filename(f"sub_stu_{sid}_assgn_{assignment_id}_{int(datetime.now().timestamp())}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    rel_url = f"/uploads/{filename}"
    conn = get_db()
    with conn.cursor() as cur:
        try:
            # Check if submission already exists
            cur.execute("""
                DELETE FROM submission WHERE student_id = :1 AND assignment_id = :2
            """, [sid, assignment_id])
            cur.execute("""
                INSERT INTO submission (student_id, assignment_id, submit_date, file_url)
                VALUES (:1, :2, TRUNC(SYSDATE), :3)
            """, [sid, assignment_id, rel_url])
            conn.commit()
            return jsonify({"message": "Assignment submission recorded successfully.", "url": rel_url})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/student/<int:sid>/toggle-event', methods=['POST'])
def student_toggle_event(sid):
    data = request.json or {}
    event_id = data.get('event_id')
    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT 1 FROM attends WHERE student_id = :1 AND event_id = :2", [sid, event_id])
            if cur.fetchone():
                cur.execute("DELETE FROM attends WHERE student_id = :1 AND event_id = :2", [sid, event_id])
                conn.commit()
                return jsonify({"status": "DEREGISTERED"})
            else:
                cur.execute("INSERT INTO attends (student_id, event_id) VALUES (:1, :2)", [sid, event_id])
                conn.commit()
                return jsonify({"status": "REGISTERED"})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/events/create', methods=['POST'])
def create_event():
    data = request.json or {}
    name = data.get('name')
    event_date = data.get('event_date')
    venue = data.get('venue')
    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT NVL(MAX(event_id), 0) + 1 FROM event")
            next_id = cur.fetchone()[0]
            cur.execute("""
                INSERT INTO event (event_id, name, event_date, venue)
                VALUES (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4)
            """, [next_id, name, event_date, venue])
            conn.commit()
            return jsonify({"message": "Event published successfully."})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

# -------------------------------------------------------------
# FACULTY PORTAL ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/faculty/<int:fid>/full-view')
def faculty_full_view(fid):
    profile = query_one("""
        SELECT f.faculty_id, f.name, f.email, f.phone, f.dept_id, d.dept_name
        FROM faculty f
        JOIN department d ON f.dept_id = d.dept_id
        WHERE f.faculty_id = :1
    """, [fid])

    classes = query_all("SELECT * FROM class WHERE faculty_id = :1 ORDER BY class_id", [fid])
    salaries = query_all("SELECT * FROM salary WHERE faculty_id = :1 ORDER BY payment_date DESC", [fid])
    complaints = query_all("""
        SELECT c.complaint_id, c.description, c.status, g.name as guardian_name, g.phone as guardian_phone
        FROM complaint c
        JOIN guardian g ON c.guardian_id = g.guardian_id
        ORDER BY c.complaint_id DESC
    """)
    subjects = query_all("SELECT * FROM subject ORDER BY subject_id")

    return jsonify({
        "profile": profile,
        "classes": classes,
        "salaries": salaries,
        "complaints": complaints,
        "subjects": subjects
    })

@app.route('/api/faculty/class/<int:cid>/details')
def faculty_class_details(cid):
    students = query_all("""
        SELECT s.student_id, s.name, s.email, s.national_id,
               (SELECT COUNT(*) FROM attendance WHERE student_id = s.student_id AND class_id = :1 AND did_attend = 'Y') as present_cnt,
               (SELECT COUNT(*) FROM attendance WHERE student_id = s.student_id AND class_id = :1) as total_cnt
        FROM enrolled_in e
        JOIN student s ON e.student_id = s.student_id
        WHERE e.class_id = :1
        ORDER BY s.student_id
    """, [cid])

    assignments = query_all("""
        SELECT a.assignment_id, a.title, a.due_date, sub.name as subject_name,
               (SELECT COUNT(*) FROM submission WHERE assignment_id = a.assignment_id) as sub_count
        FROM assignment a
        JOIN subject sub ON a.subject_id = sub.subject_id
        WHERE a.class_id = :1
        ORDER BY a.due_date DESC
    """, [cid])

    subjects = query_all("""
        SELECT cs.subject_id, sub.name, sub.credits
        FROM class_subject cs
        JOIN subject sub ON cs.subject_id = sub.subject_id
        WHERE cs.class_id = :1
    """, [cid])

    return jsonify({
        "students": students,
        "assignments": assignments,
        "subjects": subjects
    })

@app.route('/api/faculty/record-attendance', methods=['POST'])
def record_attendance():
    data = request.json or {}
    class_id = data.get('class_id')
    attend_date = data.get('attend_date')  # YYYY-MM-DD
    records = data.get('records', [])     # list of {student_id, did_attend: 'Y'/'N'}

    conn = get_db()
    with conn.cursor() as cur:
        try:
            for r in records:
                cur.execute("""
                    DELETE FROM attendance
                    WHERE student_id = :1 AND class_id = :2 AND attend_date = TO_DATE(:3, 'YYYY-MM-DD')
                """, [r['student_id'], class_id, attend_date])
                cur.execute("""
                    INSERT INTO attendance (student_id, class_id, attend_date, did_attend)
                    VALUES (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4)
                """, [r['student_id'], class_id, attend_date, r['did_attend']])
            conn.commit()
            return jsonify({"message": f"Recorded attendance for {len(records)} student(s)."})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/faculty/record-mark', methods=['POST'])
def record_mark():
    data = request.json or {}
    sid = data.get('student_id')
    sub_id = data.get('subject_id')
    atype = data.get('assessment_type')
    mark_val = float(data.get('mark', 0))
    max_mark = float(data.get('max_mark', 100))

    if mark_val < 0 or mark_val > max_mark:
        return jsonify({"error": "Validation constraint: Mark must be between 0 and maximum mark."}), 400

    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("""
                DELETE FROM mark WHERE student_id = :1 AND subject_id = :2 AND assessment_type = :3
            """, [sid, sub_id, atype])
            cur.execute("""
                INSERT INTO mark (student_id, subject_id, assessment_type, mark, max_mark)
                VALUES (:1, :2, :3, :4, :5)
            """, [sid, sub_id, atype, mark_val, max_mark])
            conn.commit()
            return jsonify({"message": "Grade entry updated successfully."})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/faculty/create-assignment', methods=['POST'])
def create_assignment():
    data = request.json or {}
    title = data.get('title')
    due_date = data.get('due_date')
    subject_id = data.get('subject_id')
    class_id = data.get('class_id')

    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT NVL(MAX(assignment_id), 0) + 1 FROM assignment")
            next_id = cur.fetchone()[0]
            cur.execute("""
                INSERT INTO assignment (assignment_id, title, due_date, subject_id, class_id)
                VALUES (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4, :5)
            """, [next_id, title, due_date, subject_id, class_id])
            conn.commit()
            return jsonify({"message": "Assignment created successfully.", "assignment_id": next_id})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/api/faculty/assignment/<int:aid>/submissions')
def view_submissions(aid):
    subs = query_all("""
        SELECT s.student_id, st.name as student_name, s.submit_date, s.file_url
        FROM submission s
        JOIN student st ON s.student_id = st.student_id
        WHERE s.assignment_id = :1
        ORDER BY s.submit_date DESC
    """, [aid])
    return jsonify(subs)

@app.route('/api/faculty/update-complaint', methods=['POST'])
def update_complaint():
    data = request.json or {}
    cid = data.get('complaint_id')
    status = data.get('status')
    if status not in ['OPEN', 'IN_PROGRESS', 'RESOLVED']:
        return jsonify({"error": "Invalid complaint status."}), 400

    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("UPDATE complaint SET status = :1 WHERE complaint_id = :2", [status, cid])
            conn.commit()
            return jsonify({"message": "Complaint status updated."})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

# -------------------------------------------------------------
# GUARDIAN (PARENT) PORTAL ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/guardian/<int:gid>/full-view')
def guardian_full_view(gid):
    profile = query_one("SELECT * FROM guardian WHERE guardian_id = :1", [gid])
    
    wards = query_all("""
        SELECT s.student_id, s.name, s.email, s.dob, s.national_id, d.dept_name
        FROM student_guardian sg
        JOIN student s ON sg.student_id = s.student_id
        JOIN department d ON s.dept_id = d.dept_id
        WHERE sg.guardian_id = :1
    """, [gid])

    complaints = query_all("SELECT * FROM complaint WHERE guardian_id = :1 ORDER BY complaint_id DESC", [gid])

    ward_details = {}
    for w in wards:
        wid = w['student_id']
        marks = query_all("""
            SELECT sub.name as subject_name, m.assessment_type, m.mark, m.max_mark
            FROM mark m JOIN subject sub ON m.subject_id = sub.subject_id
            WHERE m.student_id = :1
        """, [wid])
        fees = query_all("SELECT * FROM fee_payment WHERE student_id = :1 ORDER BY pay_date DESC", [wid])
        attendance = query_all("""
            SELECT a.attend_date, a.did_attend, c.room_id
            FROM attendance a JOIN class c ON a.class_id = c.class_id
            WHERE a.student_id = :1 ORDER BY a.attend_date DESC
        """, [wid])
        ward_details[wid] = {"marks": marks, "fees": fees, "attendance": attendance}

    return jsonify({
        "profile": profile,
        "wards": wards,
        "complaints": complaints,
        "ward_details": ward_details
    })

@app.route('/api/guardian/<int:gid>/create-complaint', methods=['POST'])
def guardian_create_complaint(gid):
    data = request.json or {}
    desc = data.get('description', '').strip()
    if not desc:
        return jsonify({"error": "Complaint grievance cannot be empty."}), 400

    conn = get_db()
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT NVL(MAX(complaint_id), 0) + 1 FROM complaint")
            next_id = cur.fetchone()[0]
            cur.execute("""
                INSERT INTO complaint (complaint_id, description, status, guardian_id)
                VALUES (:1, :2, 'OPEN', :3)
            """, [next_id, desc, gid])
            conn.commit()
            return jsonify({"message": "Grievance ticket created successfully.", "ticket_id": next_id})
        except Exception as e:
            conn.rollback()
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)