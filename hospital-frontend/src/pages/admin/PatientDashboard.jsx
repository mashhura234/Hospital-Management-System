import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/PatientDashboard.css';

function PatientDashboard() {
  const [data, setData] = useState({ stats: {}, appointments: [] });

  useEffect(() => {
    const fetchPatientData = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patient/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    };
    fetchPatientData();
  }, []);

  return (
    <div className="patient-db-container">
      <header className="db-header">
        <h1>Welcome Back, {localStorage.getItem('userName')}</h1>
        <p>Your health journey at a glance</p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <h3>{data.stats.total || 0}</h3>
          <p>Total Visits</p>
        </div>
        <div className="stat-card highlighted">
          <h3>{data.stats.upcoming || 0}</h3>
          <p>Upcoming Appointments</p>
        </div>
      </div>

      <section className="recent-appointments">
  <h3>My Recent Appointments</h3>
  <table className="pt-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Doctor Name</th>
        <th>Department</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {data.appointments.map((app, index) => (
        <tr key={app.id}>
          <td>{index + 1}</td>
          <td className="font-bold">Dr. {app.doctor_name}</td>
          <td>{app.department}</td>
          <td>{new Date(app.appointment_date).toLocaleDateString()}</td>
          <td>{app.appointment_time}</td>
          <td>
            <span className={`status-pill ${app.status}`}>
              {app.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {data.appointments.length === 0 && <p className="no-data">No appointments found.</p>}
</section>
    </div>
  );
}

export default PatientDashboard;