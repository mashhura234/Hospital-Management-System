import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageAppointments.css';

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: newStatus } : a
      ));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const getSelectStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
      completed: { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #22c55e' },
      cancelled: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' },
    };
    return { ...styles[status?.toLowerCase()], borderRadius: '6px', padding: '4px 8px', fontWeight: '600', cursor: 'pointer' };
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

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Patient</th><th>Doctor</th>
                  <th>Date</th><th>Time</th><th>Status</th><th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, i) => (
                  <tr key={appt.id} className="table-row">
                    <td>{i + 1}</td>
                    <td>{appt.patient_name}</td>
                    <td>{appt.doctor_name}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time}</td>
                    <td>
                      <span className={`status-badge status-${appt.status?.toLowerCase()}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={appt.status?.toLowerCase()}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                        style={getSelectStyle(appt.status)}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <div className="empty-state">No appointments found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAppointments;