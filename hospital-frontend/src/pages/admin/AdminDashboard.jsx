import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/AdminDashboard.css';

function AdminDashboard() {
  const stats = [
    { label: 'Total Doctors', value: 12, icon: '👨‍⚕️', color: '#0d9488' },
    { label: 'Total Patients', value: 48, icon: '🧑‍🦽', color: '#3b82f6' },
    { label: 'Departments', value: 6, icon: '🏢', color: '#8b5cf6' },
    { label: 'Appointments', value: 24, icon: '📅', color: '#f59e0b' },
  ];

  const recentAppointments = [
    { id: 1, patient: 'Rahim Uddin', doctor: 'Dr. Kamal', date: '2026-03-27', status: 'Pending' },
    { id: 2, patient: 'Nusrat Jahan', doctor: 'Dr. Sara', date: '2026-03-27', status: 'Completed' },
    { id: 3, patient: 'Arif Hossain', doctor: 'Dr. Imran', date: '2026-03-28', status: 'Cancelled' },
    { id: 4, patient: 'Fatema Begum', doctor: 'Dr. Kamal', date: '2026-03-28', status: 'Pending' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />

      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="dashboard-date">📅 {new Date().toDateString()}</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div
                className="stat-icon"
                style={{ background: stat.color + '20', color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Recent Appointments</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt) => (
                <tr key={appt.id} className="table-row">
                  <td>{appt.id}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.doctor}</td>
                  <td>{appt.date}</td>
                  <td>
                    <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 
