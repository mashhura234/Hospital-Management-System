import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/PatientHistory.css';

function PatientHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'patient') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchAppointments(parsedUser.name);
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchAppointments = async (patientName) => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } });
      const myAppts = res.data.filter(a => a.patient_name === patientName);
      setAppointments(myAppts);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status?.toLowerCase() === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar role="patient" userName={user?.name} />
      <div className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Appointment History</h1>
            <p className="dashboard-subtitle">View all your past and upcoming appointments</p>
          </div>
          <div className="history-count-badge">Total: {appointments.length}</div>
        </div>

        {/* Filter Tabs */}
        <div className="history-filter-tabs">
          {['all', 'pending', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-tab ${filter === f ? 'filter-tab-active' : 'filter-tab-inactive'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">
                {f === 'all'
                  ? appointments.length
                  : appointments.filter(a => a.status?.toLowerCase() === f).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Doctor</th><th>Department</th>
                  <th>Date</th><th>Time</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((appt, i) => (
                  <tr key={appt.id} className="table-row">
                    <td>{i + 1}</td>
                    <td><strong>{appt.doctor_name}</strong></td>
                    <td>{appt.department_name}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span className={`status-badge status-${appt.status?.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="no-data">No appointments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientHistory;