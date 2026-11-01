import React, { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:5000/api';

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  const clearAlerts = () => {
    setErrorBanner('');
    setSuccessBanner('');
  };

  const handleSignOut = () => {
    setSession(null);
    setActiveTab('dashboard');
    clearAlerts();
  };

  if (!session) {
    return <LoginView setSession={setSession} />;
  }

  return (
    <div className="portal-shell">
      {/* 1. Master Institutional Banner */}
      <header className="portal-header">
        <div className="portal-brand">
          <div className="badge-gold">VIT</div>
          <div>
            <div className="portal-title">VTOP Academic Web Portal</div>
          </div>
        </div>
        <div className="portal-user-profile">
          <div className="user-meta-summary">
            <div className="user-full-name">{session.name}</div>
            <div className="user-role-badge">{session.role.toUpperCase()} (ID: {session.id})</div>
          </div>
          <button className="btn-signout" onClick={handleSignOut}>SIGN OUT</button>
        </div>
      </header>

      {/* 2. Breadcrumbs & Session Banner */}
      <div className="portal-subbar">
        <div className="breadcrumb-trail">
          <span>VTOP</span> &gt; <span>{session.role.toUpperCase()}</span> &gt;{' '}
          <span className="active">{activeTab.toUpperCase()}</span>
        </div>
        <div className="session-timestamp">
          SESSION HOST: ORACLE-XE | LOGGED AT: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 3. Operational Body Layout */}
      <div className="portal-body">
        <aside className="portal-sidebar">
          <div className="sidebar-heading">Core Navigation</div>
          
          <button
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); clearAlerts(); }}
          >
            📊 Overview Dashboard
          </button>

          {session.role === 'student' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'marks' ? 'active' : ''}`}
                onClick={() => { setActiveTab('marks'); clearAlerts(); }}
              >
                📝 Marks & Gradebook
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('attendance'); clearAlerts(); }}
              >
                📅 Class Attendance
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('assignments'); clearAlerts(); }}
              >
                📤 Coursework Upload
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'fees' ? 'active' : ''}`}
                onClick={() => { setActiveTab('fees'); clearAlerts(); }}
              >
                💳 Digital Fee Ledger
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => { setActiveTab('events'); clearAlerts(); }}
              >
                🎪 Campus Events Hub
              </button>
            </>
          )}

          {session.role === 'faculty' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'roster' ? 'active' : ''}`}
                onClick={() => { setActiveTab('roster'); clearAlerts(); }}
              >
                👥 Class Roster & Grading
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'mark-attendance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('mark-attendance'); clearAlerts(); }}
              >
                ✍️ Daily Attendance Entry
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'create-assign' ? 'active' : ''}`}
                onClick={() => { setActiveTab('create-assign'); clearAlerts(); }}
              >
                📑 Assignment Dispatcher
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'payroll' ? 'active' : ''}`}
                onClick={() => { setActiveTab('payroll'); clearAlerts(); }}
              >
                💰 Salary Disbursements
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'helpdesk' ? 'active' : ''}`}
                onClick={() => { setActiveTab('helpdesk'); clearAlerts(); }}
              >
                🛡️ Guardian Grievance Desk
              </button>
            </>
          )}

          {session.role === 'guardian' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'wards' ? 'active' : ''}`}
                onClick={() => { setActiveTab('wards'); clearAlerts(); }}
              >
                👨‍🎓 Ward Academic Analytics
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'grievance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('grievance'); clearAlerts(); }}
              >
                ✉️ Lodge Grievance Ticket
              </button>
            </>
          )}
        </aside>

        {/* Dynamic Context Canvas */}
        <main className="portal-content">
          {errorBanner && <div className="alert-box alert-danger">{errorBanner}</div>}
          {successBanner && <div className="alert-box alert-success">{successBanner}</div>}

          {session.role === 'student' && (
            <StudentPortalView
              sid={session.id}
              activeTab={activeTab}
              setError={setErrorBanner}
              setSuccess={setSuccessBanner}
            />
          )}

          {session.role === 'faculty' && (
            <FacultyPortalView
              fid={session.id}
              activeTab={activeTab}
              setError={setErrorBanner}
              setSuccess={setSuccessBanner}
            />
          )}

          {session.role === 'guardian' && (
            <GuardianPortalView
              gid={session.id}
              activeTab={activeTab}
              setError={setErrorBanner}
              setSuccess={setSuccessBanner}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// LOGIN COMPONENT
// -------------------------------------------------------------
function LoginView({ setSession }) {
  const [role, setRole] = useState('student');
  const [id, setId] = useState('1');
  const [password, setPassword] = useState('Arjun');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const performLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, id: parseInt(id), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication rejected.');
      setSession(data);
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-top-bar">
        <div className="brand-badge">
          <div className="vtop-shield">VIT</div>
          <div>
            <div className="sys-title">VTOP School Management System</div>
            <div className="sys-sub">Enterprise Relational Education Infrastructure</div>
          </div>
        </div>
      </div>

      <div className="login-center-wrapper">
        <div className="vtop-login-card">
          <div className="login-card-header">
            <h2>Secure Sign In</h2>
            <p>Access your authorized academic dashboard</p>
          </div>
          <div className="login-card-body">
            {errMsg && <div className="alert-box alert-danger">{errMsg}</div>}
            <form onSubmit={performLogin}>
              <div className="input-group">
                <label>Institutional Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student Portal</option>
                  <option value="faculty">Faculty Portal</option>
                  <option value="guardian">Guardian / Parent Portal</option>
                </select>
              </div>

              <div className="input-group">
                <label>Registration / Account ID</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Access Password</label>
                <input
                  type="password"
                  required
                  placeholder="Your First Name"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-vtop-login" disabled={loading}>
                {loading ? 'AUTHENTICATING...' : 'LOG IN TO VTOP'}
              </button>
            </form>

            <div className="login-credentials-helper">
              <strong>Quick Test Credentials:</strong><br />
              • Student: ID <code>1</code> | Pwd: <code>Arjun</code><br />
              • Faculty: ID <code>1</code> | Pwd: <code>Anita</code><br />
              • Guardian: ID <code>1</code> | Pwd: <code>Ramesh</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// STUDENT SUB-PORTAL VIEW
// -------------------------------------------------------------
function StudentPortalView({ sid, activeTab, setError, setSuccess }) {
  const [payload, setPayload] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetAssgn, setTargetAssgn] = useState('');
  const [uploading, setUploading] = useState(false);

  // New Event Form State
  const [evName, setEvName] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evVenue, setEvVenue] = useState('');

  const fetchStudentData = async () => {
    try {
      const res = await fetch(`${API}/student/${sid}/full-view`);
      const data = await res.json();
      setPayload(data);
    } catch (e) {
      setError("Failed to synchronize student records with Oracle backend.");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [sid]);

  if (!payload) return <div>Synchronizing Relational Data...</div>;

  const { profile, classes, attendance, marks, assignments, fees, events } = payload;

  // Analytical Metrics Calculation
  const totalClassesAttended = attendance.filter(a => a.did_attend === 'Y').length;
  const attendanceRate = attendance.length > 0 ? ((totalClassesAttended / attendance.length) * 100).toFixed(1) : 0;
  const totalFeesPaid = fees.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !targetAssgn) {
      setError("Please select both a valid target assignment and a physical file.");
      return;
    }
    setUploading(true);
    setError('');

    const fd = new FormData();
    fd.append('file', selectedFile);
    fd.append('assignment_id', targetAssgn);

    try {
      const res = await fetch(`${API}/student/${sid}/upload-assignment`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Physical document successfully verified and logged into submission schema.");
      fetchStudentData();
      e.target.reset();
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleEvent = async (eventId) => {
    try {
      const res = await fetch(`${API}/student/${sid}/toggle-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Event registration state updated to: ${data.status}`);
      fetchStudentData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublishEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/events/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: evName, event_date: evDate, venue: evVenue })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("New campus event successfully posted.");
      setEvName(''); setEvDate(''); setEvVenue('');
      fetchStudentData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {/* KPI Cards */}
      <div className="metrics-row">
        <div className="metric-card gold-border">
          <div className="metric-label">Enrolled Department</div>
          <div className="metric-value">{profile.dept_name || 'General'}</div>
          <div className="metric-sub">Nat. ID: {profile.national_id}</div>
        </div>
        <div className="metric-card green-border">
          <div className="metric-label">Aggregated Attendance</div>
          <div className="metric-value">{attendanceRate}%</div>
          <div className="metric-sub">{totalClassesAttended} of {attendance.length} sessions attended</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Active Enrolments</div>
          <div className="metric-value">{classes.length}</div>
          <div className="metric-sub">Academic Term 2025-2026</div>
        </div>
        <div className="metric-card gold-border">
          <div className="metric-label">Fee Disbursements</div>
          <div className="metric-value">₹{totalFeesPaid.toLocaleString()}</div>
          <div className="metric-sub">{fees.length} Total Receipts</div>
        </div>
      </div>

      {/* Dynamic Tab Switcher */}
      {activeTab === 'dashboard' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Active Enrolled Class Timetable & Schedule</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Class ID</th>
                  <th>Assigned Room</th>
                  <th>Academic Session</th>
                  <th>Designated Class Faculty</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.class_id}>
                    <td><strong>CLS-{c.class_id}</strong></td>
                    <td>{c.room_id}</td>
                    <td>{c.academic_year}</td>
                    <td>{c.teacher_name || 'Faculty Not Appointed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Continuous Assessment & Exam Gradebook</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Course Code / Name</th>
                  <th>Credits</th>
                  <th>Assessment Type</th>
                  <th>Awarded Marks</th>
                  <th>Maximum</th>
                  <th>Score %</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => {
                  const pct = ((m.mark / m.max_mark) * 100).toFixed(1);
                  return (
                    <tr key={i}>
                      <td>{m.subject_name}</td>
                      <td>{m.credits}</td>
                      <td><strong>{m.assessment_type}</strong></td>
                      <td style={{ color: pct >= 50 ? 'green' : 'red', fontWeight: 'bold' }}>{m.mark}</td>
                      <td>{m.max_mark}</td>
                      <td>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Daily Session Attendance Log</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class Ref</th>
                  <th>Venue</th>
                  <th>Presence Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.attend_date}</td>
                    <td>Class ID: {a.class_id}</td>
                    <td>{a.room_id}</td>
                    <td>
                      <span className={`badge-pill ${a.did_attend === 'Y' ? 'badge-attend-y' : 'badge-attend-n'}`}>
                        {a.did_attend === 'Y' ? 'PRESENT' : 'ABSENT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Digital Coursework & Physical File Submissions</h3>
          </div>
          <div className="content-card-body">
            <form onSubmit={handleUploadSubmit} style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '6px' }}>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>Select Target Assignment</label>
                  <select value={targetAssgn} onChange={(e) => setTargetAssgn(e.target.value)} required>
                    <option value="">-- Choose Assignment --</option>
                    {assignments.map(a => (
                      <option key={a.assignment_id} value={a.assignment_id}>
                        {a.title} ({a.subject_name}) - Due: {a.due_date}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Select Physical Document (PDF / DOCX)</label>
                  <input type="file" required onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>
              </div>
              <button type="submit" className="btn-action-primary" disabled={uploading}>
                {uploading ? 'UPLOADING TO LOCAL DISK...' : 'SUBMIT ASSIGNMENT DOCUMENT'}
              </button>
            </form>

            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Submission Date</th>
                  <th>Archived File</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.assignment_id}>
                    <td><strong>{a.title}</strong></td>
                    <td>{a.subject_name}</td>
                    <td>{a.due_date}</td>
                    <td>{a.submit_date || <span style={{ color: '#ef4444' }}>Pending</span>}</td>
                    <td>
                      {a.file_url ? (
                        <a href={`http://localhost:5000${a.file_url}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 'bold' }}>
                          View Archived PDF
                        </a>
                      ) : 'No file on record'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Tuition & Institutional Fee Payments</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Receipt Ref ID</th>
                  <th>Payment Date</th>
                  <th>Disbursed Amount</th>
                  <th>Transaction Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.fee_id}>
                    <td>REC-{f.fee_id}</td>
                    <td>{f.pay_date}</td>
                    <td><strong>₹{parseFloat(f.amount).toLocaleString()}</strong></td>
                    <td><span className="badge-pill badge-resolved">PROCESSED & SETTLED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Campus Extracurricular & Tech Symposiums</h3>
          </div>
          <div className="content-card-body">
            <div style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '6px' }}>
              <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Organize & Register New Campus Event</h4>
              <form onSubmit={handlePublishEvent} className="form-grid-2">
                <div className="input-group">
                  <label>Event Name</label>
                  <input type="text" required placeholder="e.g. GraVITas Hackathon" value={evName} onChange={e => setEvName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Scheduled Date</label>
                  <input type="date" required value={evDate} onChange={e => setEvDate(e.target.value)} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Campus Venue</label>
                  <input type="text" required placeholder="e.g. Anna Auditorium" value={evVenue} onChange={e => setEvVenue(e.target.value)} />
                </div>
                <button type="submit" className="btn-action-primary">PUBLISH OFFICIAL EVENT</button>
              </form>
            </div>

            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.event_id}>
                    <td><strong>{ev.name}</strong></td>
                    <td>{ev.event_date}</td>
                    <td>{ev.venue}</td>
                    <td>
                      <button
                        className={`btn-action-sm ${ev.reg_status === 'REGISTERED' ? 'btn-sm-green' : 'btn-sm-blue'}`}
                        onClick={() => handleToggleEvent(ev.event_id)}
                      >
                        {ev.reg_status === 'REGISTERED' ? '✓ ENROLLED (LEAVE)' : '+ REGISTER ATTENDANCE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// FACULTY SUB-PORTAL VIEW
// -------------------------------------------------------------
function FacultyPortalView({ fid, activeTab, setError, setSuccess }) {
  const [payload, setPayload] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  // Attendance Form
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attMap, setAttMap] = useState({});

  // Grade Entry Form
  const [gradeSid, setGradeSid] = useState('');
  const [gradeSubId, setGradeSubId] = useState('');
  const [gradeType, setGradeType] = useState('MIDTERM');
  const [gradeMark, setGradeMark] = useState('');
  const [gradeMax, setGradeMax] = useState('50');

  // Assignment Form
  const [asTitle, setAsTitle] = useState('');
  const [asDue, setAsDue] = useState('');
  const [asSubId, setAsSubId] = useState('');
  const [asClassId, setAsClassId] = useState('');

  // Submissions Modal
  const [inspectingAssgn, setInspectingAssgn] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);

  const fetchFacultyData = async () => {
    try {
      const res = await fetch(`${API}/faculty/${fid}/full-view`);
      const data = await res.json();
      setPayload(data);
      if (data.classes.length > 0 && !selectedClass) {
        setSelectedClass(data.classes[0].class_id);
      }
    } catch (e) {
      setError("Failed to synchronize faculty portfolio from Oracle backend.");
    }
  };

  const fetchClassDetails = async (cid) => {
    try {
      const res = await fetch(`${API}/faculty/class/${cid}/details`);
      const data = await res.json();
      setClassDetails(data);
      // Initialize attendance map
      const initMap = {};
      data.students.forEach(s => { initMap[s.student_id] = 'Y'; });
      setAttMap(initMap);
    } catch (e) {
      setError("Failed to fetch detailed roster.");
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, [fid]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassDetails(selectedClass);
    }
  }, [selectedClass]);

  if (!payload) return <div>Synchronizing Relational Data...</div>;

  const { profile, classes, salaries, complaints, subjects } = payload;

  const submitAttendance = async (e) => {
    e.preventDefault();
    const records = Object.entries(attMap).map(([sid, did_attend]) => ({
      student_id: parseInt(sid),
      did_attend
    }));

    try {
      const res = await fetch(`${API}/faculty/record-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class_id: selectedClass, attend_date: attDate, records })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Attendance successfully persisted into relational schema.");
      fetchClassDetails(selectedClass);
    } catch (err) {
      setError(err.message);
    }
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/faculty/record-mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: gradeSid,
          subject_id: gradeSubId,
          assessment_type: gradeType,
          mark: gradeMark,
          max_mark: gradeMax
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Evaluation grade entry successfully verified and recorded.");
      setGradeMark('');
    } catch (err) {
      setError(err.message);
    }
  };

  const submitAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/faculty/create-assignment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: asTitle,
          due_date: asDue,
          subject_id: asSubId,
          class_id: asClassId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Course assignment registered for enrolled students.");
      setAsTitle(''); setAsDue('');
      if (selectedClass) fetchClassDetails(selectedClass);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResolveComplaint = async (cid, status) => {
    try {
      const res = await fetch(`${API}/faculty/update-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_id: cid, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Grievance ticket state changed.");
      fetchFacultyData();
    } catch (err) {
      setError(err.message);
    }
  };

  const inspectSubmissions = async (aid) => {
    try {
      const res = await fetch(`${API}/faculty/assignment/${aid}/submissions`);
      const data = await res.json();
      setSubmissionsList(data);
      setInspectingAssgn(aid);
    } catch (err) {
      setError("Failed to retrieve submissions.");
    }
  };

  return (
    <div>
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Assigned Department</div>
          <div className="metric-value">{profile.dept_name}</div>
          <div className="metric-sub">{profile.email}</div>
        </div>
        <div className="metric-card gold-border">
          <div className="metric-label">Assigned Sections</div>
          <div className="metric-value">{classes.length}</div>
          <div className="metric-sub">Classroom Teacher Appointments</div>
        </div>
        <div className="metric-card green-border">
          <div className="metric-label">Latest Salary Disbursed</div>
          <div className="metric-value">
            {salaries.length > 0 ? `₹${parseFloat(salaries[0].amount).toLocaleString()}` : 'N/A'}
          </div>
          <div className="metric-sub">{salaries.length > 0 ? salaries[0].payment_date : 'No Records'}</div>
        </div>
        <div className="metric-card red-border">
          <div className="metric-label">Open Grievance Tickets</div>
          <div className="metric-value">{complaints.filter(c => c.status === 'OPEN').length}</div>
          <div className="metric-sub">Parent / Guardian Lodged</div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Faculty Designated Course Sections</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Class Ref</th>
                  <th>Classroom Room ID</th>
                  <th>Session Period</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.class_id}>
                    <td><strong>CLASS ID #{c.class_id}</strong></td>
                    <td>{c.room_id}</td>
                    <td>{c.academic_year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roster' && (
        <div>
          <div className="content-card">
            <div className="content-card-header">
              <h3>Select Active Teaching Section</h3>
              <select
                value={selectedClass || ''}
                onChange={e => setSelectedClass(parseInt(e.target.value))}
                style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                {classes.map(c => (
                  <option key={c.class_id} value={c.class_id}>
                    Class ID: {c.class_id} (Room {c.room_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="content-card-body">
              {classDetails && (
                <>
                  <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Enrolled Students & Performance Roster</h4>
                  <table className="vtop-data-table" style={{ marginBottom: '2rem' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Institutional Email</th>
                        <th>Attendance %</th>
                        <th>Quick Grade Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classDetails.students.map(s => {
                        const pct = s.total_cnt > 0 ? ((s.present_cnt / s.total_cnt) * 100).toFixed(1) : 0;
                        return (
                          <tr key={s.student_id}>
                            <td>{s.student_id}</td>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.email}</td>
                            <td>
                              <span style={{ fontWeight: 'bold', color: pct >= 75 ? '#15803d' : '#b91c1c' }}>
                                {pct}% ({s.present_cnt}/{s.total_cnt})
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-action-sm btn-sm-blue"
                                onClick={() => setGradeSid(s.student_id)}
                              >
                                Select for Grading
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Grade Awarding Form */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '6px' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Award Assessment Evaluation Marks</h4>
                    <form onSubmit={submitGrade} className="form-grid-2">
                      <div className="input-group">
                        <label>Selected Student ID</label>
                        <input type="number" required value={gradeSid} onChange={e => setGradeSid(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Target Subject</label>
                        <select required value={gradeSubId} onChange={e => setGradeSubId(e.target.value)}>
                          <option value="">-- Select Subject --</option>
                          {classDetails.subjects.map(sub => (
                            <option key={sub.subject_id} value={sub.subject_id}>
                              {sub.name} (ID: {sub.subject_id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Assessment Type</label>
                        <select value={gradeType} onChange={e => setGradeType(e.target.value)}>
                          <option value="MIDTERM">Midterm Examination</option>
                          <option value="FINAL">Final Examination</option>
                          <option value="QUIZ1">Quiz 1</option>
                          <option value="QUIZ2">Quiz 2</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Awarded Mark / Score</label>
                        <input type="number" step="0.5" required value={gradeMark} onChange={e => setGradeMark(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Max Possible Score</label>
                        <input type="number" step="0.5" required value={gradeMax} onChange={e => setGradeMax(e.target.value)} />
                      </div>
                      <button type="submit" className="btn-action-primary" style={{ alignSelf: 'end' }}>
                        SAVE EVALUATION SCORE
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mark-attendance' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Batch Daily Attendance Marker</h3>
            <select
              value={selectedClass || ''}
              onChange={e => setSelectedClass(parseInt(e.target.value))}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {classes.map(c => (
                <option key={c.class_id} value={c.class_id}>Class ID: {c.class_id}</option>
              ))}
            </select>
          </div>
          <div className="content-card-body">
            {classDetails && (
              <form onSubmit={submitAttendance}>
                <div className="input-group" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
                  <label>Attendance Session Date</label>
                  <input type="date" required value={attDate} onChange={e => setAttDate(e.target.value)} />
                </div>

                <table className="vtop-data-table" style={{ marginBottom: '1.5rem' }}>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classDetails.students.map(s => (
                      <tr key={s.student_id}>
                        <td>{s.student_id}</td>
                        <td><strong>{s.name}</strong></td>
                        <td>
                          <select
                            value={attMap[s.student_id] || 'Y'}
                            onChange={e => setAttMap({ ...attMap, [s.student_id]: e.target.value })}
                            style={{ padding: '4px 8px', borderRadius: '4px' }}
                          >
                            <option value="Y">PRESENT (Y)</option>
                            <option value="N">ABSENT (N)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="submit" className="btn-action-primary">
                  COMMIT ATTENDANCE ENTRIES TO DATABASE
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create-assign' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Coursework Assignment Management</h3>
          </div>
          <div className="content-card-body">
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '6px', marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Create New Course Assignment</h4>
              <form onSubmit={submitAssignment} className="form-grid-2">
                <div className="input-group">
                  <label>Assignment Title</label>
                  <input type="text" required placeholder="e.g. Lab Exercise 4" value={asTitle} onChange={e => setAsTitle(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Submission Due Date</label>
                  <input type="date" required value={asDue} onChange={e => setAsDue(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <select required value={asSubId} onChange={e => setAsSubId(e.target.value)}>
                    <option value="">-- Choose Subject --</option>
                    {subjects.map(s => (
                      <option key={s.subject_id} value={s.subject_id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Assign to Class</label>
                  <select required value={asClassId} onChange={e => setAsClassId(e.target.value)}>
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => (
                      <option key={c.class_id} value={c.class_id}>Class ID: {c.class_id}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-action-primary">DISPATCH ASSIGNMENT</button>
              </form>
            </div>

            {classDetails && (
              <>
                <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Existing Class Assignments & Submissions</h4>
                <table className="vtop-data-table">
                  <thead>
                    <tr>
                      <th>Assignment Title</th>
                      <th>Subject</th>
                      <th>Due Date</th>
                      <th>Turned In</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classDetails.assignments.map(a => (
                      <tr key={a.assignment_id}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.subject_name}</td>
                        <td>{a.due_date}</td>
                        <td>{a.sub_count} Submissions</td>
                        <td>
                          <button
                            className="btn-action-sm btn-sm-blue"
                            onClick={() => inspectSubmissions(a.assignment_id)}
                          >
                            Inspect Submissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {inspectingAssgn && (
              <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid #cbd5e1', padding: '1.25rem', borderRadius: '6px' }}>
                <h4>Submissions for Assignment Ref #{inspectingAssgn}</h4>
                <table className="vtop-data-table" style={{ marginTop: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Turn In Date</th>
                      <th>Uploaded Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissionsList.map(sub => (
                      <tr key={sub.student_id}>
                        <td>{sub.student_id}</td>
                        <td>{sub.student_name}</td>
                        <td>{sub.submit_date}</td>
                        <td>
                          <a href={`http://localhost:5000${sub.file_url}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 'bold' }}>
                            Download Uploaded File
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Faculty Monthly Salary Disbursement History</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Salary Voucher</th>
                  <th>Disbursement Date</th>
                  <th>Amount Disbursed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map(s => (
                  <tr key={s.salary_id}>
                    <td>SAL-REF-{s.salary_id}</td>
                    <td>{s.payment_date}</td>
                    <td><strong>₹{parseFloat(s.amount).toLocaleString()}</strong></td>
                    <td><span className="badge-pill badge-resolved">SETTLED BY ACCOUNTS</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'helpdesk' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Guardian Grievance Resolution Desk</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Guardian</th>
                  <th>Contact</th>
                  <th>Grievance Statement</th>
                  <th>Status</th>
                  <th>Resolve Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.complaint_id}>
                    <td>TKT-{c.complaint_id}</td>
                    <td><strong>{c.guardian_name}</strong></td>
                    <td>{c.guardian_phone}</td>
                    <td>{c.description}</td>
                    <td>
                      <span className={`badge-pill badge-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status !== 'RESOLVED' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn-action-sm btn-sm-blue"
                            onClick={() => handleResolveComplaint(c.complaint_id, 'IN_PROGRESS')}
                          >
                            Mark In Progress
                          </button>
                          <button
                            className="btn-action-sm btn-sm-green"
                            onClick={() => handleResolveComplaint(c.complaint_id, 'RESOLVED')}
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// GUARDIAN (PARENT) SUB-PORTAL VIEW
// -------------------------------------------------------------
function GuardianPortalView({ gid, activeTab, setError, setSuccess }) {
  const [payload, setPayload] = useState(null);
  const [ticketDesc, setTicketDesc] = useState('');

  const fetchGuardianData = async () => {
    try {
      const res = await fetch(`${API}/guardian/${gid}/full-view`);
      const data = await res.json();
      setPayload(data);
    } catch (e) {
      setError("Failed to synchronize guardian records from Oracle backend.");
    }
  };

  useEffect(() => {
    fetchGuardianData();
  }, [gid]);

  if (!payload) return <div>Synchronizing Relational Data...</div>;

  const { profile, wards, complaints, ward_details } = payload;

  const handleLodgeTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/guardian/${gid}/create-complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: ticketDesc })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Official grievance ticket created and assigned to faculty board.");
      setTicketDesc('');
      fetchGuardianData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Guardian Primary Profile</div>
          <div className="metric-value">{profile.name}</div>
          <div className="metric-sub">Registered Contact: {profile.phone}</div>
        </div>
        <div className="metric-card gold-border">
          <div className="metric-label">Registered Wards</div>
          <div className="metric-value">{wards.length} Students</div>
          <div className="metric-sub">Associated Under Guardian Entity</div>
        </div>
        <div className="metric-card red-border">
          <div className="metric-label">Active Support Tickets</div>
          <div className="metric-value">{complaints.filter(c => c.status !== 'RESOLVED').length} Pending</div>
          <div className="metric-sub">{complaints.length} Total Raised</div>
        </div>
      </div>

      {(activeTab === 'dashboard' || activeTab === 'wards') && (
        <div>
          {wards.map(w => {
            const wData = ward_details[w.student_id] || { marks: [], fees: [], attendance: [] };
            const attRate = wData.attendance.length > 0
              ? ((wData.attendance.filter(a => a.did_attend === 'Y').length / wData.attendance.length) * 100).toFixed(1)
              : 0;

            return (
              <div key={w.student_id} className="content-card">
                <div className="content-card-header">
                  <h3>Ward: {w.name} (ID #{w.student_id}) — {w.dept_name}</h3>
                </div>
                <div className="content-card-body">
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                    <div>Attendance Rate: <span style={{ color: attRate >= 75 ? 'green' : 'red' }}>{attRate}%</span></div>
                    <div>National ID: {w.national_id}</div>
                    <div>DOB: {w.dob}</div>
                  </div>

                  <h4 style={{ marginBottom: '0.75rem', color: '#002147' }}>Academic Performance</h4>
                  <table className="vtop-data-table" style={{ marginBottom: '2rem' }}>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Assessment</th>
                        <th>Awarded Mark</th>
                        <th>Max Mark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wData.marks.map((m, i) => (
                        <tr key={i}>
                          <td>{m.subject_name}</td>
                          <td>{m.assessment_type}</td>
                          <td><strong>{m.mark}</strong></td>
                          <td>{m.max_mark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h4 style={{ marginBottom: '0.75rem', color: '#002147' }}>Tuition Fee Ledger</h4>
                  <table className="vtop-data-table">
                    <thead>
                      <tr>
                        <th>Fee Ref</th>
                        <th>Date Paid</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wData.fees.map(f => (
                        <tr key={f.fee_id}>
                          <td>FEE-REC-{f.fee_id}</td>
                          <td>{f.pay_date}</td>
                          <td><strong>₹{parseFloat(f.amount).toLocaleString()}</strong></td>
                          <td><span className="badge-pill badge-resolved">CLEARED</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'grievance' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Lodge Official Grievance Ticket</h3>
          </div>
          <div className="content-card-body">
            <form onSubmit={handleLodgeTicket} style={{ marginBottom: '2rem' }}>
              <div className="input-group">
                <label>Grievance / Issue Narrative</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detail your academic or administrative grievance here..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-action-primary">
                LODGE OFFICIAL GRIEVANCE TICKET
              </button>
            </form>

            <h4 style={{ marginBottom: '1rem', color: '#002147' }}>Submitted Grievance History</h4>
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Ticket Ref</th>
                  <th>Statement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.complaint_id}>
                    <td>TKT-REF-{c.complaint_id}</td>
                    <td>{c.description}</td>
                    <td>
                      <span className={`badge-pill badge-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}