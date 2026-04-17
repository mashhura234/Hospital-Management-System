import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManagePatients.css';

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients',
        { headers: { Authorization: `Bearer ${token}` } });
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Patients</h1>
            <p className="dashboard-subtitle">View all registered patients</p>
          </div>
          <div className="patient-count-badge">Total: {patients.length} Patients</div>
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Name</th><th>Age</th>
                  <th>Gender</th><th>Phone</th><th>Email</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p.id} className="table-row">
                    <td>{i + 1}</td>
                    <td>
                      <div className="patient-name-cell">
                        <div className={`patient-avatar ${p.gender === 'female' ? 'female' : 'male'}`}>
                          {p.name?.[0]}
                        </div>
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.age}</td>
                    <td>
                      <span className={`gender-badge ${p.gender?.toLowerCase()}`}>{p.gender}</span>
                    </td>
                    <td>{p.phone}</td>
                    <td>{p.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && <div className="empty-state">No patients found.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePatients;