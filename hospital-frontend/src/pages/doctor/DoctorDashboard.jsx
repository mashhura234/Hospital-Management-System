import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user and token from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch doctor's appointments
      getBackendData(token);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const getBackendData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Logic for the Stat Cards
  const totalCount = appointments.length;
  const completedCount = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;
  const pendingCount = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role || 'doctor'} userName={user?.name} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Dashboard</h1>
            <p className="dashboard-subtitle">Welcome, {user?.name}! Real-time appointment data.</p>
          </div>
          <div className="dashboard-date">📅 {new Date().toDateString()}</div>
        </div>

        {/* Dynamic Stats */}
        <div className="doctor-stats">
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #0d9488' }}>
            <div className="stat-value">{loading ? "..." : totalCount}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div className="stat-value">{loading ? "..." : completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="doctor-stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="stat-value">{loading ? "..." : pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Today's Appointments</h2>
          </div>
          
          {loading ? (
            <p className="p-5">Connecting to database...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, i) => (
              <tr key={appt.id} className="table-row">
             <td>{i + 1}</td>
             {/* Notice we use appt.patient_name because of your SQL query */}
              <td><strong>{appt.patient_name}</strong></td> 
    
            {/* Formatting the date and time from your DB */}
           <td>{appt.time} ({new Date(appt.date).toLocaleDateString()})</td>
    
          <td>
           <span className={`status-badge status-${appt.status.toLowerCase()}`}>
        {appt.status}
          </span>
           </td>
           </tr>
           ))}
              </tbody>
            </table>
          )}
          {!loading && appointments.length === 0 && (
            <p className="p-5 text-center text-gray-500">No appointments found in the database.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;