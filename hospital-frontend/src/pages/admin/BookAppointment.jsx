import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/BookAppointment.css';

function BookAppointment() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Load all departments first
    axios.get('http://localhost:5000/api/departments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setDepartments(res.data));
  }, []);

  const handleDeptClick = async (deptId) => {
    setSelectedDept(deptId);
    const res = await axios.get(`http://localhost:5000/api/schedule/department/${deptId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setDoctors(res.data.doctors);
  };

  return (
    <div className="booking-container">
      <h2>Book an Appointment</h2>
      
      {!selectedDept ? (
        <div className="dept-selection">
          <h3>Select a Department</h3>
          <div className="dept-list">
            {departments.map(d => (
              <button key={d.id} onClick={() => handleDeptClick(d.id)} className="dept-btn">
                {d.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="doctor-selection">
          <button onClick={() => setSelectedDept(null)} className="back-link">← Back to Departments</button>
          <h3>Available Doctors</h3>
          <div className="doc-grid">
            {doctors.map(doc => (
              <div key={doc.doctor_id} className="booking-doc-card">
                <h4>Dr. {doc.doctor_name}</h4>
                <p className="spec">{doc.specialization}</p>
                <div className="availability">
                  <span>📅 {doc.available_days}</span>
                  <span>⏰ {doc.time_start} - {doc.time_end}</span>
                </div>
                <button className="select-slot-btn">Check Available Slots</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;