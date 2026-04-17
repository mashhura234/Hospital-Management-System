import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me',
          { headers: { Authorization: `Bearer ${token}` } });
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        if (fetchedUser.role !== 'admin') { navigate('/login'); return; }
        localStorage.setItem('user', JSON.stringify(fetchedUser));
        fetchDashboardStats();
      } catch (err) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const storedUser = JSON.parse(userStr);
            if (storedUser.role !== 'admin') { navigate('/login'); return; }
            setUser(storedUser);
            fetchDashboardStats();
          } else { navigate('/login'); }
        } catch { navigate('/login'); }
      }
    };
    fetchUser();
  }, [token, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/admin',
        { headers: { Authorization: `Bearer ${token}` } });
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName={user?.name} />
      <div className="dashboard-main"><p className="loading-text">Loading...</p></div>
    </div>
  );

  if (error) return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName={user?.name} />
      <div className="dashboard-main"><p className="error-text">{error}</p></div>
    </div>
  );

  const statCards = [
    { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: '👨‍⚕️', color: '#0d9488', path: '/admin/doctors' },
    { label: 'Total Patients', value: stats?.totalPatients || 0, icon: '🧑‍🦽', color: '#3b82f6', path: '/admin/patients' },
    { label: 'Departments', value: stats?.totalDepartments || 0, icon: '🏢', color: '#8b5cf6', path: '/admin/departments' },
    { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: '📅', color: '#f59e0b', path: '/admin/appointments' },
    { label: 'Pending', value: stats?.pendingAppointments || 0, icon: '⏳', color: '#ef4444', path: '/admin/appointments' },
    { label: 'Completed', value: stats?.completedAppointments || 0, icon: '✅', color: '#22c55e', path: '/admin/appointments' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName={user?.name} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name}! Here's what's happening today.</p>
          </div>
          <div className="header-actions">
            <div className="dashboard-date">📅 {new Date().toDateString()}</div>
          </div>
        </div>

        <div className="stats-grid">
          {statCards.map((stat, i) => (
            <div key={i} className="stat-card"
              onClick={() => navigate(stat.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon" style={{ background: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-card-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Recent Appointments</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th><th>Patient</th><th>Doctor</th>
                <th>Date</th><th>Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentAppointments?.length > 0 ? (
                stats.recentAppointments.map((appt, index) => (
                  <tr key={appt.id} className="table-row">
                    <td>{index + 1}</td>
                    <td>{appt.patient_name}</td>
                    <td>{appt.doctor_name}</td>
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
                <tr><td colSpan="6" className="no-data">No appointments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;