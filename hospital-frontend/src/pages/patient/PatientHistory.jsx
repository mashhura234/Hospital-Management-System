import React from 'react';
import Sidebar from '../../components/Sidebar';

function PatientHistory() {
  const history = [
    { id: 1, doctor: 'Dr. Imran Ali', date: '2026-03-10', status: 'Completed' },
    { id: 2, doctor: 'Dr. Sara Islam', date: '2026-02-25', status: 'Completed' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar role="patient" userName="Rahim Uddin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Appointment History</h1>
            <p className="dashboard-subtitle">Review your past appointments.</p>
          </div>
        </div>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.doctor}</td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;
