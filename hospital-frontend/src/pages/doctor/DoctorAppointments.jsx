import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

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
      setSlotSuccess('✅ Slot added successfully!');
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

  const getSelectStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b' },
      completed: { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #22c55e' },
      cancelled: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #ef4444' },
    };
    return { ...styles[status?.toLowerCase()], borderRadius: '6px', padding: '4px 8px', fontWeight: '600', cursor: 'pointer' };
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontWeight: '600',
    background: activeTab === tab ? '#0d9488' : '#e2e8f0',
    color: activeTab === tab ? 'white' : '#333'
  });

  const inputStyle = {
    padding: '8px 12px', borderRadius: '6px',
    border: '1px solid #cbd5e1', fontSize: '14px'
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => setActiveTab('appointments')} style={tabStyle('appointments')}>
            📋 My Appointments
          </button>
          <button onClick={() => setActiveTab('availability')} style={tabStyle('availability')}>
            📅 My Availability Slots
          </button>
        </div>

        {/* Appointments Tab */}
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
                      <td><strong>{appt.patient_name}</strong></td>
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
                          style={getSelectStyle(appt.status)}>
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

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div>
            {/* Add Slot Form */}
            <div className="table-card" style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '16px', color: '#0d9488' }}>➕ Add New Availability Slot</h3>
              {slotError && <div style={{ color: 'red', marginBottom: '10px', padding: '8px', background: '#fee2e2', borderRadius: '6px' }}>{slotError}</div>}
              {slotSuccess && <div style={{ color: 'green', marginBottom: '10px', padding: '8px', background: '#d1fae5', borderRadius: '6px' }}>{slotSuccess}</div>}

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>📅 Date</label>
                  <input
                    type="date"
                    value={slotForm.available_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSlotForm({ ...slotForm, available_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>⏰ Start Time</label>
                  <input
                    type="time"
                    value={slotForm.available_time}
                    onChange={e => setSlotForm({ ...slotForm, available_time: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>⏰ End Time</label>
                  <input
                    type="time"
                    value={slotForm.available_end_time}
                    onChange={e => setSlotForm({ ...slotForm, available_end_time: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <button
                  onClick={handleAddSlot}
                  style={{
                    padding: '8px 24px', backgroundColor: '#0d9488',
                    color: 'white', border: 'none', borderRadius: '6px',
                    fontWeight: '600', cursor: 'pointer', height: '38px'
                  }}>
                  ➕ Add Slot
                </button>
              </div>
            </div>

            {/* Slots Table */}
            <div className="table-card">
              <h3 style={{ marginBottom: '16px', color: '#0d9488' }}>📋 My Availability Slots</h3>
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
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                          background: slot.is_booked ? '#fee2e2' : '#d1fae5',
                          color: slot.is_booked ? '#991b1b' : '#065f46'
                        }}>
                          {slot.is_booked ? '🔴 Booked' : '🟢 Available'}
                        </span>
                      </td>
                      <td>
                        {!slot.is_booked && (
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            style={{
                              padding: '4px 12px', backgroundColor: '#ef4444',
                              color: 'white', border: 'none', borderRadius: '6px',
                              cursor: 'pointer', fontSize: '12px'
                            }}>
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