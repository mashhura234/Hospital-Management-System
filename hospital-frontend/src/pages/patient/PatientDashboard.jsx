import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/PatientDashboard.css';

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'patient') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchStats();
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/patient',
        { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err);
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
  if (window.confirm('Are you sure you want to cancel this appointment?')) {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } });
      fetchStats();
    } catch {
      alert('Failed to cancel appointment.');
    }
  }
};

  const statCards = [
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, color: '#0d9488', path: '/patient/history' },
    { label: 'Upcoming', value: stats?.upcomingAppointments || 0, color: '#3b82f6', path: '/patient/history' },
    { label: 'Completed', value: stats?.completedAppointments || 0, color: '#22c55e', path: '/patient/history' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="patient" userName={user?.name} />
      <div className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Patient Dashboard</h1>
            <p className="dashboard-subtitle">Welcome, {user?.name}! Here's your health summary.</p>
          </div>
          <div className="dashboard-date">📅 {new Date().toDateString()}</div>
        </div>

        <div className="patient-stats">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="patient-stat-card"
              style={{ borderTop: `4px solid ${stat.color}` }}
              onClick={() => navigate(stat.path)}
            >
              <div className="stat-value">{loading ? '...' : stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Recent Appointments</h2>
            <button
              className="view-all-btn"
              onClick={() => navigate('/patient/history')}>
              View All →
            </button>
          </div>
          {loading ? <p className="loading-text">Loading...</p> : (
            <table className="data-table">
  <thead>
    <tr className="table-head-row">
      <th>#</th><th>Doctor</th><th>Department</th>
      <th>Date</th><th>Time</th><th>Status</th><th>Action</th>
    </tr>
  </thead>
  <tbody>
    {stats?.appointmentHistory?.length > 0 ? (
      stats.appointmentHistory.map((appt, i) => (
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
          <td>
            {appt.status?.toLowerCase() === 'pending' && (
              <button
                className="btn-cancel-appt"
                onClick={() => handleCancelAppointment(appt.id)}>
                Cancel
              </button>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="7" className="no-data">No appointments yet</td></tr>
    )}
  </tbody>
</table>
          )}
        </div>

        <div className="patient-quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => navigate('/patient/book-appointment')}>
            📋 Book New Appointment
          </button>
          <button
            className="quick-action-btn-outline"
            onClick={() => navigate('/patient/history')}>
            🕓 View Full History
          </button>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;