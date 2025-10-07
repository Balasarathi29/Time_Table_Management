import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';

function ViewTimetable() {
  const [timetable, setTimetable] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = () => {
    const data = storage.getTimetable();
    const sorted = data.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
    setTimetable(sorted);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="container">
          <h1>Examination Time Table</h1>
          <p>Check your exam schedule below</p>
          <button onClick={() => navigate('/login')} className="btn btn-outline">
            Admin Login
          </button>
        </div>
      </div>

      <div className="view-content">
        <div className="container">
          <div className="card">
            {timetable.length === 0 ? (
              <div className="no-data-large">
                <div className="no-data-icon">📅</div>
                <h3>No Exams Scheduled Yet</h3>
                <p>The exam timetable will be published here soon.</p>
              </div>
            ) : (
              <>
                <div className="timetable-header">
                  <h2>Upcoming Examinations</h2>
                  <p className="exam-count">Total Exams: {timetable.length}</p>
                </div>
                <div className="table-responsive">
                  <table className="timetable-table public-view">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Subject</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((exam, index) => (
                        <tr key={exam.id}>
                          <td>{index + 1}</td>
                          <td className="subject-name">{exam.subject}</td>
                          <td>{new Date(exam.exam_date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}</td>
                          <td className="exam-time">{exam.exam_time}</td>
                          <td className="remarks">{exam.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="timetable-footer">
                  <p><strong>Important Notes:</strong></p>
                  <ul>
                    <li>Students must arrive 15 minutes before the exam time</li>
                    <li>Bring your student ID card and admit card</li>
                    <li>Mobile phones and electronic devices are not allowed in the exam hall</li>
                    <li>Check the notice board regularly for any updates or changes</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTimetable;
