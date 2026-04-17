import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorSchedule.css';

function DoctorSchedule() {
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors',
        { headers: { Authorization: `Bearer ${token}` } });
      setDoctors(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const fetchAvailability = async (doctorId) => {
    if (expandedDoctor === doctorId) { setExpandedDoctor(null); return; }
    try {
      const res = await axios.get(`http://localhost:5000/api/availability/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setAvailability(prev => ({ ...prev, [doctorId]: res.data }));
      setExpandedDoctor(doctorId);
    } catch {
      setAvailability(prev => ({ ...prev, [doctorId]: [] }));
      setExpandedDoctor(doctorId);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Schedules</h1>
            <p className="dashboard-subtitle">View availability slots for each doctor</p>
          </div>
          <button onClick={fetchDoctors} className="btn-add">🔄 Refresh</button>
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Doctor</th><th>Department</th>
                  <th>Specialization</th><th>Phone</th><th>View Schedule</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <React.Fragment key={doc.id}>
                    <tr className="table-row">
                      <td>{i + 1}</td>
                      <td><strong>{doc.name}</strong></td>
                      <td>{doc.department_name}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.phone}</td>
                      <td>
                        <button
                          onClick={() => fetchAvailability(doc.id)}
                          className="btn-edit"
                        >
                          {expandedDoctor === doc.id ? 'Hide' : 'View Slots'}
                        </button>
                      </td>
                    </tr>
                    {expandedDoctor === doc.id && (
                      <tr>
                        <td colSpan="6" style={{ backgroundColor: '#f8fafc', padding: '16px' }}>
                          {availability[doc.id]?.length > 0 ? (
                            <table style={{ width: '100%' }}>
                              <thead>
                                <tr style={{ background: '#e2e8f0' }}>
                                  <th style={{ padding: '8px' }}>Date</th>
                                  <th style={{ padding: '8px' }}>Time</th>
                                  <th style={{ padding: '8px' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {availability[doc.id].map(slot => (
                                  <tr key={slot.id}>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      {new Date(slot.available_date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      {slot.available_time}
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>
                                      <span style={{
                                        padding: '3px 10px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        background: slot.is_booked ? '#fee2e2' : '#d1fae5',
                                        color: slot.is_booked ? '#991b1b' : '#065f46'
                                      }}>
                                        {slot.is_booked ? 'Booked' : 'Available'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p style={{ textAlign: 'center', color: '#666' }}>No availability slots set yet.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && <div className="empty-state">No doctors found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorSchedule;