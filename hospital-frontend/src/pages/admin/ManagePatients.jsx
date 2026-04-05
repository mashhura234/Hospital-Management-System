 
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManagePatients.css';

function ManagePatients() {
  const [patients] = useState([
    { id: 1, name: 'Rahim Uddin', age: 35, gender: 'Male', phone: '01811000001', email: 'rahim@email.com' },
    { id: 2, name: 'Nusrat Jahan', age: 28, gender: 'Female', phone: '01811000002', email: 'nusrat@email.com' },
    { id: 3, name: 'Arif Hossain', age: 45, gender: 'Male', phone: '01811000003', email: 'arif@email.com' },
    { id: 4, name: 'Fatema Begum', age: 32, gender: 'Female', phone: '01811000004', email: 'fatema@email.com' },
  ]);

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Patients</h1>
            <p className="dashboard-subtitle">View all registered patients</p>
          </div>
          <div className="patient-count-badge">
            Total: {patients.length} Patients
          </div>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id} className="table-row">
                  <td>{i + 1}</td>
                  <td>
                    <div className="patient-name-cell">
                      <div className={`patient-avatar ${p.gender === 'Female' ? 'female' : 'male'}`}>
                        {p.name[0]}
                      </div>
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.age}</td>
                  <td>
                    <span className={`gender-badge ${p.gender.toLowerCase()}`}>{p.gender}</span>
                  </td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagePatients;