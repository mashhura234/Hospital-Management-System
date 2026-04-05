import React from 'react';
import Sidebar from '../../components/Sidebar';

function DoctorPatients() {
  const patients = [
    { id: 1, name: 'Rahim Uddin', age: 35, lastVisit: '2026-03-20' },
    { id: 2, name: 'Nusrat Jahan', age: 28, lastVisit: '2026-03-22' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName="Dr. Kamal" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Patient List</h1>
            <p className="dashboard-subtitle">View patient details in your care.</p>
          </div>
        </div>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;
