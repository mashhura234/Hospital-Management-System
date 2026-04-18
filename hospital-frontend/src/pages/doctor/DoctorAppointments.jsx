import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorAppointments.css';

function DoctorAppointments() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotForm, setSlotForm] = useState({
    available_date: '',
    available_time: '',
    available_end_time: ''
  });
  const [slotError, setSlotError] = useState('');
  const [slotSuccess, setSlotSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'doctor') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchAppointments(parsedUser.name);
      fetchMyAvailability();
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchAppointments = async (doctorName) => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } });
      const myAppts = res.data.filter(a => a.doctor_name === doctorName);
      setAppointments(myAppts);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const fetchMyAvailability = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/availability/my',
        { headers: { Authorization: `Bearer ${token}` } });
      setAvailability(res.data);
    } catch {}
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: newStatus } : a));
    } catch { alert('Failed to update status.'); }
  };

  const handleAddSlot = async () => {
    setSlotError('');
    setSlotSuccess('');
    if (!slotForm.available_date || !slotForm.available_time || !slotForm.available_end_time) {
      setSlotError('Date, start time and end time are all required.');
      return;
    }
    if (slotForm.available_time >= slotForm.available_end_time) {
      setSlotError('End time must be after start time.');
      return;
    }
    try {
      const formatTime = (t) => t.split(':').length === 2 ? `${t}:00` : t;
      await axios.post('http://localhost:5000/api/availability', {
        available_date: slotForm.available_date,
        available_time: formatTime(slotForm.available_time),
        available_end_time: formatTime(slotForm.available_end_time)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSlotSuccess('Slot added successfully!');
      setSlotForm({ available_date: '', available_time: '', available_end_time: '' });
      fetchMyAvailability();
      setTimeout(() => setSlotSuccess(''), 3000);
    } catch (err) {
      setSlotError(err.response?.data?.message || 'Failed to add slot.');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Delete this slot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/availability/${id}`,
          { headers: { Authorization: `Bearer ${token}` } });
        fetchMyAvailability();
      } catch (err) {
        alert(err.response?.data?.message || 'Cannot delete booked slot.');
      }
    }
  };

  const getStatusClass = (status) => {
    const map = {
      pending: 'select-status-pending',
      completed: 'select-status-completed',
      cancelled: 'select-status-cancelled'
    };
    return map[status?.toLowerCase()] || 'select-status-pending';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName={user?.name} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Appointments & Schedule</h1>
            <p className="dashboard-subtitle">Manage your appointments and availability</p>
          </div>
        </div>

        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            onClick={() => setActiveTab('appointments')}>
            📋 My Appointments
          </button>
          <button
            className={`tab-btn ${activeTab === 'availability' ? 'tab-btn-active' : 'tab-btn-inactive'}`}
            onClick={() => setActiveTab('availability')}>
            📅 My Availability Slots
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className="table-card">
            {loading ? <p className="loading-text">Loading...</p> : (
              <table className="data-table">
                <thead>
                  <tr className="table-head-row">
                    <th>#</th><th>Patient</th><th>Date</th>
                    <th>Time</th><th>Status</th><th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? appointments.map((appt, i) => (
                    <tr key={appt.id} className="table-row">
                      <td>{i + 1}</td>
                      <td>
                        <div className="patient-name-cell">
                          <div className="patient-avatar-sm">{appt.patient_name?.[0]}</div>
                          <strong>{appt.patient_name}</strong>
                        </div>
                      </td>
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
                          className={getStatusClass(appt.status)}>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="no-data">No appointments found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div>
            <div className="slot-form-card">
              <h3 className="slot-form-title">➕ Add New Availability Slot</h3>
              {slotError && <div className="slot-error">{slotError}</div>}
              {slotSuccess && <div className="slot-success">{slotSuccess}</div>}
              <div className="slot-form-row">
                <div className="slot-form-group">
                  <label className="slot-form-label">📅 Date</label>
                  <input
                    type="date"
                    value={slotForm.available_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSlotForm({ ...slotForm, available_date: e.target.value })}
                    className="slot-form-input"
                  />
                </div>
                <div className="slot-form-group">
                  <label className="slot-form-label">⏰ Start Time</label>
                  <input
                    type="time"
                    value={slotForm.available_time}
                    onChange={e => setSlotForm({ ...slotForm, available_time: e.target.value })}
                    className="slot-form-input"
                  />
                </div>
                <div className="slot-form-group">
                  <label className="slot-form-label">⏰ End Time</label>
                  <input
                    type="time"
                    value={slotForm.available_end_time}
                    onChange={e => setSlotForm({ ...slotForm, available_end_time: e.target.value })}
                    className="slot-form-input"
                  />
                </div>
                <button className="slot-add-btn" onClick={handleAddSlot}>
                  ➕ Add Slot
                </button>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3 className="table-title">📋 My Availability Slots</h3>
              </div>
              <table className="data-table">
                <thead>
                  <tr className="table-head-row">
                    <th>#</th><th>Date</th><th>Start Time</th>
                    <th>End Time</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.length > 0 ? availability.map((slot, i) => (
                    <tr key={slot.id} className="table-row">
                      <td>{i + 1}</td>
                      <td>{new Date(slot.available_date).toLocaleDateString()}</td>
                      <td>{slot.available_time}</td>
                      <td>{slot.available_end_time || '-'}</td>
                      <td>
                        <span className={slot.is_booked ? 'slot-status-booked' : 'slot-status-available'}>
                          {slot.is_booked ? '🔴 Booked' : '🟢 Available'}
                        </span>
                      </td>
                      <td>
                        {!slot.is_booked && (
                          <button className="btn-delete-slot" onClick={() => handleDeleteSlot(slot.id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="no-data">No availability slots added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;