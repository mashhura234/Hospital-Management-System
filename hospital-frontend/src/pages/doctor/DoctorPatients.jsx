import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorPatients.css';

function DoctorPatients() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'doctor') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchPatients(parsedUser.name);
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchPatients = async (doctorName) => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } });
      const myAppointments = res.data.filter(a => a.doctor_name === doctorName);
      const uniquePatients = [];
      const seen = new Set();
      myAppointments.forEach(a => {
        if (!seen.has(a.patient_name)) {
          seen.add(a.patient_name);
          uniquePatients.push({
            id: a.id,
            name: a.patient_name,
            lastVisit: a.date,
            status: a.status
          });
        }
      });
      setPatients(uniquePatients);
      setLoading(false);
    } catch { setLoading(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName={user?.name} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Patients</h1>
            <p className="dashboard-subtitle">Patients who have appointments with you</p>
          </div>
          <div className="patient-count-badge">Total: {patients.length} Patients</div>
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Patient Name</th><th>Last Visit</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? patients.map((p, i) => (
                  <tr key={p.id} className="table-row">
                    <td>{i + 1}</td>
                    <td>
                      <div className="patient-name-cell">
                        <div className="patient-avatar-sm">{p.name?.[0]}</div>
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{new Date(p.lastVisit).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${p.status?.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="no-data">No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorPatients;