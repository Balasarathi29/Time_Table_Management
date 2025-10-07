import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';

function Dashboard() {
  const [timetable, setTimetable] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    exam_date: '',
    exam_time: '',
    remarks: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadTimetable();
  }, [navigate]);

  const loadTimetable = () => {
    const data = storage.getTimetable();
    const sorted = data.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
    setTimetable(sorted);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      storage.updateExam(editingId, formData);
      setMessage('Exam schedule updated successfully!');
      setEditingId(null);
    } else {
      storage.addExam(formData);
      setMessage('Exam schedule added successfully!');
    }

    setFormData({
      subject: '',
      exam_date: '',
      exam_time: '',
      remarks: ''
    });

    loadTimetable();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (exam) => {
    setFormData({
      subject: exam.subject,
      exam_date: exam.exam_date,
      exam_time: exam.exam_time,
      remarks: exam.remarks || ''
    });
    setEditingId(exam.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam entry?')) {
      storage.deleteExam(id);
      setMessage('Exam schedule deleted successfully!');
      loadTimetable();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      subject: '',
      exam_date: '',
      exam_time: '',
      remarks: ''
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage Exam Time Table</p>
            </div>
            <div className="header-actions">
              <button onClick={() => navigate('/view')} className="btn btn-secondary">
                View Public Timetable
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {message && <div className="alert alert-success">{message}</div>}

          <div className="card">
            <h2>{editingId ? 'Edit Exam Entry' : 'Add New Exam Entry'}</h2>
            <form onSubmit={handleSubmit} className="exam-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject">Subject Name *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Physics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exam_date">Exam Date *</label>
                  <input
                    type="date"
                    id="exam_date"
                    name="exam_date"
                    value={formData.exam_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exam_time">Exam Time *</label>
                  <input
                    type="time"
                    id="exam_time"
                    name="exam_time"
                    value={formData.exam_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="remarks">Remarks (Optional)</label>
                  <input
                    type="text"
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Additional notes or instructions"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Exam' : 'Add Exam'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h2>Manage Exam Schedules ({timetable.length})</h2>
            {timetable.length === 0 ? (
              <p className="no-data">No exam schedules added yet. Add your first exam above.</p>
            ) : (
              <div className="table-responsive">
                <table className="timetable-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((exam) => (
                      <tr key={exam.id}>
                        <td>{exam.subject}</td>
                        <td>{new Date(exam.exam_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</td>
                        <td>{exam.exam_time}</td>
                        <td>{exam.remarks || '-'}</td>
                        <td className="actions">
                          <button
                            onClick={() => handleEdit(exam)}
                            className="btn-icon btn-edit"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(exam.id)}
                            className="btn-icon btn-delete"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
