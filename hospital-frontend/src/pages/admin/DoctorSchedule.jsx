import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/DoctorSchedule.css';

function DoctorSchedule() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/schedule/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Accessing the 'doctors' array from your new backend structure
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch schedule data. Please check if the server is running.");
      setLoading(false);
    }
  };

  if (loading) return <div className="schedule-loader">Loading Doctor Schedules...</div>;
  if (error) return <div className="schedule-error">{error}</div>;

  return (
    <div className="schedule-page">
      <div className="schedule-header-main">
        <div>
          <h1>Doctor Schedules & Analytics</h1>
          <p>Monitoring {doctors.length} doctors across all departments</p>
        </div>
        <button onClick={fetchSchedules} className="refresh-schedule-btn">Update List</button>
      </div>

      <div className="schedule-card-grid">
        {doctors.map((doc) => (
          <div key={doc.doctor_id} className="doc-schedule-card">
            <div className="doc-card-header">
              <div className="doc-profile-circle">
                {doc.doctor_name.charAt(0)}
              </div>
              <div className="doc-name-area">
                <h3>{doc.doctor_name}</h3>
                <span className="doc-dept-label">{doc.department}</span>
              </div>
            </div>

            <div className="doc-stats-row">
              <div className="stat-item">
                <span className="stat-value">{doc.total_appointments}</span>
                <span className="stat-label">Total Appts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{doc.unique_patients}</span>
                <span className="stat-label">Patients</span>
              </div>
              <div className="stat-item">
                <span className="stat-value text-teal-600">
                  {doc.scheduled_appointments}
                </span>
                <span className="stat-label">Upcoming</span>
              </div>
            </div>

            <div className="availability-section">
              <div className="avail-info">
                <strong>Days:</strong> <span>{doc.available_days}</span>
              </div>
              <div className="avail-info">
                <strong>Hours:</strong> <span>{doc.time_start} - {doc.time_end}</span>
              </div>
            </div>

            <button className="view-details-btn">View Full Calendar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorSchedule;