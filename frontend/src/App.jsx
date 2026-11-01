import React, { useState, useEffect } from 'react';
import './App.css';

const API = ' https://fraction-lloyd-alcohol-merge.trycloudflare.com/api';

/* --- CLEAN PROFESSIONAL VECTOR ICONS --- */
const Icons = {
  Crest: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  Marks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Ledger: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Events: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Checklist: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  HelpDesk: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  SignOut: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
};

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
      {/* 1. Header Banner */}
      <header className="portal-header">
        <div className="portal-brand">
          <div className="brand-crest"><Icons.Crest /></div>
          <div className="brand-logo-text">SCHOOL MANAGEMENT SYSTEM</div>
        </div>
        <div className="portal-user-profile">
          <div className="user-meta-summary">
            <div className="user-full-name">{session.name}</div>
            <div className="user-role-badge">{session.role.toUpperCase()} • ID #{session.id}</div>
          </div>
          <button className="btn-signout" onClick={handleSignOut}>
            <Icons.SignOut /> Sign Out
          </button>
        </div>
      </header>

      {/* 2. Subbar & Breadcrumb */}
      <div className="portal-subbar">
        <div className="breadcrumb-trail">
          <span>PORTAL</span> &gt; <span>{session.role.toUpperCase()}</span> &gt;{' '}
          <span className="active">{activeTab.toUpperCase()}</span>
        </div>
        <div className="session-timestamp">
          DATABASE STATUS: ACTIVE | {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="portal-body">
        <aside className="portal-sidebar">
          <div className="sidebar-heading">Navigation Menu</div>
          
          <button
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); clearAlerts(); }}
          >
            <Icons.Dashboard /> Dashboard Overview
          </button>

          {session.role === 'student' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'marks' ? 'active' : ''}`}
                onClick={() => { setActiveTab('marks'); clearAlerts(); }}
              >
                <Icons.Marks /> Academic Gradebook
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('attendance'); clearAlerts(); }}
              >
                <Icons.Calendar /> Attendance Records
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('assignments'); clearAlerts(); }}
              >
                <Icons.Upload /> Coursework Submissions
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'fees' ? 'active' : ''}`}
                onClick={() => { setActiveTab('fees'); clearAlerts(); }}
              >
                <Icons.Ledger /> Tuition & Fee Receipts
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => { setActiveTab('events'); clearAlerts(); }}
              >
                <Icons.Events /> Campus Events
              </button>
            </>
          )}

          {session.role === 'faculty' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'roster' ? 'active' : ''}`}
                onClick={() => { setActiveTab('roster'); clearAlerts(); }}
              >
                <Icons.Users /> Student Rosters & Marks
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'mark-attendance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('mark-attendance'); clearAlerts(); }}
              >
                <Icons.Checklist /> Attendance Registry
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'create-assign' ? 'active' : ''}`}
                onClick={() => { setActiveTab('create-assign'); clearAlerts(); }}
              >
                <Icons.FileText /> Assignment Manager
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'payroll' ? 'active' : ''}`}
                onClick={() => { setActiveTab('payroll'); clearAlerts(); }}
              >
                <Icons.Ledger /> Salary Statements
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'helpdesk' ? 'active' : ''}`}
                onClick={() => { setActiveTab('helpdesk'); clearAlerts(); }}
              >
                <Icons.HelpDesk /> Support Grievances
              </button>
            </>
          )}

          {session.role === 'guardian' && (
            <>
              <button
                className={`nav-item-btn ${activeTab === 'wards' ? 'active' : ''}`}
                onClick={() => { setActiveTab('wards'); clearAlerts(); }}
              >
                <Icons.Users /> Ward Performance
              </button>
              <button
                className={`nav-item-btn ${activeTab === 'grievance' ? 'active' : ''}`}
                onClick={() => { setActiveTab('grievance'); clearAlerts(); }}
              >
                <Icons.HelpDesk /> Support Grievances
              </button>
            </>
          )}
        </aside>

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
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
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
          <div className="brand-crest"><Icons.Crest /></div>
          <div>
            <div className="sys-title">SCHOOL MANAGEMENT SYSTEM</div>
            <div className="sys-sub">Enterprise Relational Education Infrastructure</div>
          </div>
        </div>
      </div>

      <div className="login-center-wrapper">
        <div className="sms-login-card">
          <div className="login-card-header">
            <h2>System Authentication</h2>
            <p>Access your authorized academic dashboard</p>
          </div>
          <div className="login-card-body">
            {errMsg && <div className="alert-box alert-danger">{errMsg}</div>}
            <form onSubmit={performLogin}>
              <div className="input-group">
                <label>User Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="guardian">Guardian / Parent</option>
                </select>
              </div>

              <div className="input-group">
                <label>Account ID</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  placeholder="First name (e.g. Arjun)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-sms-login" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="login-credentials-helper">
              <strong>Pre-loaded Accounts:</strong><br />
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
// STUDENT VIEW
// -------------------------------------------------------------
function StudentPortalView({ sid, activeTab, setError, setSuccess }) {
  const [payload, setPayload] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetAssgn, setTargetAssgn] = useState('');
  const [uploading, setUploading] = useState(false);

  const [evName, setEvName] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evVenue, setEvVenue] = useState('');

  const fetchStudentData = async () => {
    try {
      const res = await fetch(`${API}/student/${sid}/full-view`);
      const data = await res.json();
      setPayload(data);
    } catch (e) {
      setError("Failed to fetch student data from server.");
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [sid]);

  if (!payload) return <div>Loading records...</div>;

  const { profile, classes, attendance, marks, assignments, fees, events } = payload;
  const totalClassesAttended = attendance.filter(a => a.did_attend === 'Y').length;
  const attendanceRate = attendance.length > 0 ? ((totalClassesAttended / attendance.length) * 100).toFixed(1) : 0;
  const totalFeesPaid = fees.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !targetAssgn) {
      setError("Please select both an assignment and a file.");
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
      setSuccess("Assignment file successfully uploaded.");
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
      setSuccess(`Event registration updated: ${data.status}`);
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
      setSuccess("New event added successfully.");
      setEvName(''); setEvDate(''); setEvVenue('');
      fetchStudentData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Department</div>
          <div className="metric-value">{profile.dept_name || 'General'}</div>
          <div className="metric-sub">ID: {profile.national_id}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Attendance Rate</div>
          <div className="metric-value">{attendanceRate}%</div>
          <div className="metric-sub">{totalClassesAttended} of {attendance.length} sessions attended</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Enrolled Classes</div>
          <div className="metric-value">{classes.length}</div>
          <div className="metric-sub">Current Term</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Fees Paid</div>
          <div className="metric-value">₹{totalFeesPaid.toLocaleString()}</div>
          <div className="metric-sub">{fees.length} Total Receipts</div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Registered Classes & Schedules</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Class Reference</th>
                  <th>Classroom</th>
                  <th>Academic Term</th>
                  <th>Faculty Instructor</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.class_id}>
                    <td><strong>Class #{c.class_id}</strong></td>
                    <td>{c.room_id}</td>
                    <td>{c.academic_year}</td>
                    <td>{c.teacher_name || 'Unassigned'}</td>
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
            <h3>Continuous Assessments & Exam Grades</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Max Score</th>
                  <th>Percentage</th>
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
                      <td style={{ fontWeight: 'bold' }}>{m.mark}</td>
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
            <h3>Daily Session Attendance History</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class Reference</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={i}>
                    <td>{a.attend_date}</td>
                    <td>Class #{a.class_id}</td>
                    <td>{a.room_id}</td>
                    <td>
                      <span className={`badge-pill ${a.did_attend === 'Y' ? 'badge-attend-y' : 'badge-attend-n'}`}>
                        {a.did_attend === 'Y' ? 'Present' : 'Absent'}
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
            <h3>Course Assignments & Submissions</h3>
          </div>
          <div className="content-card-body">
            <form onSubmit={handleUploadSubmit} style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--sms-border)' }}>
              <div className="form-grid-2">
                <div className="input-group">
                  <label>Target Assignment</label>
                  <select value={targetAssgn} onChange={(e) => setTargetAssgn(e.target.value)} required>
                    <option value="">-- Select Assignment --</option>
                    {assignments.map(a => (
                      <option key={a.assignment_id} value={a.assignment_id}>
                        {a.title} ({a.subject_name}) - Due: {a.due_date}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Document File (PDF / DOCX)</label>
                  <input type="file" required onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>
              </div>
              <button type="submit" className="btn-action-primary" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Submit Document'}
              </button>
            </form>

            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Due Date</th>
                  <th>Submission Date</th>
                  <th>Uploaded Document</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.assignment_id}>
                    <td><strong>{a.title}</strong></td>
                    <td>{a.subject_name}</td>
                    <td>{a.due_date}</td>
                    <td>{a.submit_date || <span style={{ color: '#dc2626' }}>Pending</span>}</td>
                    <td>
                      {a.file_url ? (
                        <a href={`http://localhost:5000${a.file_url}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 'bold' }}>
                          View File
                        </a>
                      ) : 'No file uploaded'}
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
            <h3>Tuition & Fee Ledger</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Receipt Number</th>
                  <th>Payment Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.fee_id}>
                    <td>REC-00{f.fee_id}</td>
                    <td>{f.pay_date}</td>
                    <td><strong>₹{parseFloat(f.amount).toLocaleString()}</strong></td>
                    <td><span className="badge-pill badge-resolved">Settled</span></td>
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
            <h3>Campus Events & Registrations</h3>
          </div>
          <div className="content-card-body">
            <div style={{ marginBottom: '2rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--sms-border)' }}>
              <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Create New Event</h4>
              <form onSubmit={handlePublishEvent} className="form-grid-2">
                <div className="input-group">
                  <label>Event Name</label>
                  <input type="text" required placeholder="Event Title" value={evName} onChange={e => setEvName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" required value={evDate} onChange={e => setEvDate(e.target.value)} />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Venue</label>
                  <input type="text" required placeholder="Campus Location" value={evVenue} onChange={e => setEvVenue(e.target.value)} />
                </div>
                <button type="submit" className="btn-action-primary">Publish Event</button>
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
                        {ev.reg_status === 'REGISTERED' ? 'Enrolled (Leave)' : 'Register Attendance'}
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
// FACULTY VIEW
// -------------------------------------------------------------
function FacultyPortalView({ fid, activeTab, setError, setSuccess }) {
  const [payload, setPayload] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classDetails, setClassDetails] = useState(null);

  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attMap, setAttMap] = useState({});

  const [gradeSid, setGradeSid] = useState('');
  const [gradeSubId, setGradeSubId] = useState('');
  const [gradeType, setGradeType] = useState('MIDTERM');
  const [gradeMark, setGradeMark] = useState('');
  const [gradeMax, setGradeMax] = useState('50');

  const [asTitle, setAsTitle] = useState('');
  const [asDue, setAsDue] = useState('');
  const [asSubId, setAsSubId] = useState('');
  const [asClassId, setAsClassId] = useState('');

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
      setError("Failed to fetch faculty details from server.");
    }
  };

  const fetchClassDetails = async (cid) => {
    try {
      const res = await fetch(`${API}/faculty/class/${cid}/details`);
      const data = await res.json();
      setClassDetails(data);
      const initMap = {};
      data.students.forEach(s => { initMap[s.student_id] = 'Y'; });
      setAttMap(initMap);
    } catch (e) {
      setError("Failed to fetch class roster.");
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

  if (!payload) return <div>Loading records...</div>;

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
      setSuccess("Attendance saved successfully.");
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
      setSuccess("Grade recorded successfully.");
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
      setSuccess("Assignment created successfully.");
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
      setSuccess("Grievance status updated.");
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
          <div className="metric-label">Department</div>
          <div className="metric-value">{profile.dept_name}</div>
          <div className="metric-sub">{profile.email}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Assigned Classes</div>
          <div className="metric-value">{classes.length}</div>
          <div className="metric-sub">Active Sections</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Latest Salary</div>
          <div className="metric-value">
            {salaries.length > 0 ? `₹${parseFloat(salaries[0].amount).toLocaleString()}` : 'N/A'}
          </div>
          <div className="metric-sub">{salaries.length > 0 ? salaries[0].payment_date : 'No records'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Open Grievances</div>
          <div className="metric-value">{complaints.filter(c => c.status === 'OPEN').length}</div>
          <div className="metric-sub">Parent Inquiries</div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Assigned Class Sections</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Class Reference</th>
                  <th>Room</th>
                  <th>Academic Term</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(c => (
                  <tr key={c.class_id}>
                    <td><strong>Class #{c.class_id}</strong></td>
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
              <h3>Class Student Roster</h3>
              <select
                value={selectedClass || ''}
                onChange={e => setSelectedClass(parseInt(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--sms-border-strong)' }}
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
                  <table className="vtop-data-table" style={{ marginBottom: '2rem' }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Attendance Rate</th>
                        <th>Action</th>
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
                              <span style={{ fontWeight: 'bold' }}>
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

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--sms-border)' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Enter Evaluation Grade</h4>
                    <form onSubmit={submitGrade} className="form-grid-2">
                      <div className="input-group">
                        <label>Student ID</label>
                        <input type="number" required value={gradeSid} onChange={e => setGradeSid(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Subject</label>
                        <select required value={gradeSubId} onChange={e => setGradeSubId(e.target.value)}>
                          <option value="">-- Choose Subject --</option>
                          {classDetails.subjects.map(sub => (
                            <option key={sub.subject_id} value={sub.subject_id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Assessment Type</label>
                        <select value={gradeType} onChange={e => setGradeType(e.target.value)}>
                          <option value="MIDTERM">Midterm</option>
                          <option value="FINAL">Final</option>
                          <option value="QUIZ1">Quiz 1</option>
                          <option value="QUIZ2">Quiz 2</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Mark</label>
                        <input type="number" step="0.5" required value={gradeMark} onChange={e => setGradeMark(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Maximum Mark</label>
                        <input type="number" step="0.5" required value={gradeMax} onChange={e => setGradeMax(e.target.value)} />
                      </div>
                      <button type="submit" className="btn-action-primary" style={{ alignSelf: 'end' }}>
                        Save Grade
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
            <h3>Attendance Registry Entry</h3>
            <select
              value={selectedClass || ''}
              onChange={e => setSelectedClass(parseInt(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--sms-border-strong)' }}
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
                  <label>Session Date</label>
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
                            style={{ padding: '6px 12px', borderRadius: '4px' }}
                          >
                            <option value="Y">Present</option>
                            <option value="N">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="submit" className="btn-action-primary">
                  Save Attendance Records
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create-assign' && (
        <div className="content-card">
          <div className="content-card-header">
            <h3>Assignment Manager</h3>
          </div>
          <div className="content-card-body">
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--sms-border)', marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Dispatch New Assignment</h4>
              <form onSubmit={submitAssignment} className="form-grid-2">
                <div className="input-group">
                  <label>Title</label>
                  <input type="text" required placeholder="Assignment Title" value={asTitle} onChange={e => setAsTitle(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" required value={asDue} onChange={e => setAsDue(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Subject</label>
                  <select required value={asSubId} onChange={e => setAsSubId(e.target.value)}>
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => (
                      <option key={s.subject_id} value={s.subject_id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Assign to Class</label>
                  <select required value={asClassId} onChange={e => setAsClassId(e.target.value)}>
                    <option value="">-- Select Class --</option>
                    {classes.map(c => (
                      <option key={c.class_id} value={c.class_id}>Class #{c.class_id}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-action-primary">Create Assignment</button>
              </form>
            </div>

            {classDetails && (
              <>
                <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Class Assignments</h4>
                <table className="vtop-data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Due Date</th>
                      <th>Submissions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classDetails.assignments.map(a => (
                      <tr key={a.assignment_id}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.subject_name}</td>
                        <td>{a.due_date}</td>
                        <td>{a.sub_count} Submitted</td>
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
              <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid var(--sms-border)', padding: '1.25rem', borderRadius: '6px' }}>
                <h4>Submissions for Assignment #{inspectingAssgn}</h4>
                <table className="vtop-data-table" style={{ marginTop: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Turned In Date</th>
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
                            View File
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
            <h3>Faculty Salary Statements</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Voucher Ref</th>
                  <th>Payment Date</th>
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
                    <td><span className="badge-pill badge-resolved">Settled</span></td>
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
            <h3>Parent Support Grievances</h3>
          </div>
          <div className="content-card-body">
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Guardian</th>
                  <th>Phone</th>
                  <th>Grievance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.complaint_id}>
                    <td>TKT-00{c.complaint_id}</td>
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
// GUARDIAN (PARENT) VIEW
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
      setError("Failed to fetch guardian records.");
    }
  };

  useEffect(() => {
    fetchGuardianData();
  }, [gid]);

  if (!payload) return <div>Loading records...</div>;

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
      setSuccess("Support ticket lodged successfully.");
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
          <div className="metric-label">Guardian</div>
          <div className="metric-value">{profile.name}</div>
          <div className="metric-sub">{profile.phone}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Registered Wards</div>
          <div className="metric-value">{wards.length} Student(s)</div>
          <div className="metric-sub">Linked to Profile</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Open Tickets</div>
          <div className="metric-value">{complaints.filter(c => c.status !== 'RESOLVED').length} Active</div>
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
                    <div>Attendance: <span style={{ color: attRate >= 75 ? '#16a34a' : '#dc2626' }}>{attRate}%</span></div>
                    <div>National ID: {w.national_id}</div>
                    <div>DOB: {w.dob}</div>
                  </div>

                  <h4 style={{ marginBottom: '0.75rem', color: '#0f172a' }}>Academic Marks</h4>
                  <table className="vtop-data-table" style={{ marginBottom: '2rem' }}>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Assessment</th>
                        <th>Mark</th>
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

                  <h4 style={{ marginBottom: '0.75rem', color: '#0f172a' }}>Fee Payments</h4>
                  <table className="vtop-data-table">
                    <thead>
                      <tr>
                        <th>Receipt ID</th>
                        <th>Payment Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wData.fees.map(f => (
                        <tr key={f.fee_id}>
                          <td>REC-00{f.fee_id}</td>
                          <td>{f.pay_date}</td>
                          <td><strong>₹{parseFloat(f.amount).toLocaleString()}</strong></td>
                          <td><span className="badge-pill badge-resolved">Settled</span></td>
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
            <h3>Lodge Support Grievance</h3>
          </div>
          <div className="content-card-body">
            <form onSubmit={handleLodgeTicket} style={{ marginBottom: '2rem' }}>
              <div className="input-group">
                <label>Grievance Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detail your inquiry or grievance here..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-action-primary">
                Submit Support Ticket
              </button>
            </form>

            <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Submitted Grievances</h4>
            <table className="vtop-data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Statement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.complaint_id}>
                    <td>TKT-00{c.complaint_id}</td>
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