import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorDashboard.css';

function DoctorDashboard() {
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
      if (parsedUser.role !== 'doctor') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchStats();
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/doctor',
        { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err);
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: '📅', color: '#0d9488' },
    { label: "Today's Appointments", value: stats?.todayAppointments || 0, icon: '🗓️', color: '#3b82f6' },
    { label: 'Pending', value: stats?.pendingAppointments || 0, icon: '⏳', color: '#f59e0b' },
    { label: 'Completed', value: stats?.completedAppointments || 0, icon: '✅', color: '#22c55e' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName={user?.name} />
      <div className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Dashboard</h1>
            <p className="dashboard-subtitle">Welcome, {user?.name}!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="dashboard-date">📅 {new Date().toDateString()}</div>
            
          </div>
        </div>

        {/* Stat Cards */}
        <div className="doctor-stats">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="doctor-stat-card"
              style={{ borderTop: `4px solid ${stat.color}`, cursor: 'pointer' }}
              onClick={() => navigate('/doctor/appointments')}
              title="Click to view appointments"
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div className="stat-value">{loading ? '...' : stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Appointments Table */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Recent Appointments</h2>
            <button
              onClick={() => navigate('/doctor/appointments')}
              style={{
                padding: '6px 16px',
                backgroundColor: '#0d948820',
                color: '#0d9488',
                border: '1px solid #0d9488',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px'
              }}>
              View All →
            </button>
          </div>

          {loading ? <p className="loading-text">Loading...</p> : (
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentAppointments?.length > 0 ? (
                  stats.recentAppointments.map((appt, i) => (
                    <tr key={appt.id} className="table-row">
                      <td>{i + 1}</td>
                      <td><strong>{appt.patient_name}</strong></td>
                      <td>{new Date(appt.date).toLocaleDateString()}</td>
                      <td>{appt.time}</td>
                      <td>
                        <span className={`status-badge status-${appt.status?.toLowerCase()}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="no-data">No appointments yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;