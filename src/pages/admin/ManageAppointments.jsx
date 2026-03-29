 
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageAppointments.css';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Rahim Uddin', doctor: 'Dr. Kamal Hossain', date: '2026-03-27', time: '10:00 AM', status: 'Pending' },
    { id: 2, patient: 'Nusrat Jahan', doctor: 'Dr. Sara Islam', date: '2026-03-27', time: '11:00 AM', status: 'Completed' },
    { id: 3, patient: 'Arif Hossain', doctor: 'Dr. Imran Ali', date: '2026-03-28', time: '02:00 PM', status: 'Cancelled' },
    { id: 4, patient: 'Fatema Begum', doctor: 'Dr. Kamal Hossain', date: '2026-03-28', time: '03:00 PM', status: 'Pending' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Appointments</h1>
            <p className="dashboard-subtitle">View and update appointment statuses</p>
          </div>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, i) => (
                <tr key={appt.id} className="table-row">
                  <td>{i + 1}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.doctor}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span className={`status-badge status-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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

export default ManageAppointments;