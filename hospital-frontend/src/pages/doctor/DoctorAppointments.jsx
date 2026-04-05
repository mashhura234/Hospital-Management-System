import React from 'react';
import Sidebar from '../../components/Sidebar';

function DoctorAppointments() {
  const appointments = [
    { id: 1, patient: 'Rahim Uddin', date: '2026-03-30', time: '10:00 AM', status: 'Pending' },
    { id: 2, patient: 'Nusrat Jahan', date: '2026-04-01', time: '11:00 AM', status: 'Completed' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName="Dr. Kamal" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Appointments</h1>
            <p className="dashboard-subtitle">Manage your appointment queue.</p>
          </div>
        </div>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.patient}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;
