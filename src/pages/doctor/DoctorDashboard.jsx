 
import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const todayAppointments = [
    { id: 1, patient: 'Rahim Uddin', age: 35, time: '10:00 AM', status: 'Pending' },
    { id: 2, patient: 'Fatema Begum', age: 28, time: '11:00 AM', status: 'Completed' },
    { id: 3, patient: 'Arif Hossain', age: 45, time: '02:00 PM', status: 'Pending' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName="Dr. Kamal" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Dashboard</h1>
            <p className="dashboard-subtitle">Welcome, Dr. Kamal! Here are your appointments today.</p>
          </div>
          <div className="dashboard-date">📅 {new Date().toDateString()}</div>
        </div>

        {/* Stats */}
        <div className="doctor-stats">
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #0d9488' }}>
            <div className="stat-value">{todayAppointments.length}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div className="stat-value">
              {todayAppointments.filter(a => a.status === 'Completed').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="stat-value">
              {todayAppointments.filter(a => a.status === 'Pending').length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Today's Appointments</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointments.map((appt, i) => (
                <tr key={appt.id} className="table-row">
                  <td>{i + 1}</td>
                  <td><strong>{appt.patient}</strong></td>
                  <td>{appt.age} yrs</td>
                  <td>{appt.time}</td>
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

export default DoctorDashboard;