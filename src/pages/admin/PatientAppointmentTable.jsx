import React from 'react';

const rows = [
  { id: 1, name: 'Samir Ahmed', age: 34, gender: 'Male', address: 'Dhaka', mobile: '017XXXXXXXX', department: 'Cardiology', date: '2026-04-01', time: '10:00 AM', status: 'Approved' },
  { id: 2, name: 'Nusrat Jahan', age: 28, gender: 'Female', address: 'Chittagong', mobile: '018XXXXXXXX', department: 'Neurology', date: '2026-04-01', time: '11:30 AM', status: 'Pending' },
  { id: 3, name: 'Rahim Uddin', age: 40, gender: 'Male', address: 'Sylhet', mobile: '019XXXXXXXX', department: 'Orthopedics', date: '2026-04-02', time: '09:15 AM', status: 'Approved' },
];

function PatientAppointmentTable() {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Patient Appointment List</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-blue-50 text-left">
            <th className="p-3">Patient Name</th>
            <th className="p-3">Age</th>
            <th className="p-3">Gender</th>
            <th className="p-3">Address</th>
            <th className="p-3">Mobile</th>
            <th className="p-3">Department</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-semibold">{row.name[0]}</span>
                {row.name}
              </td>
              <td className="p-3">{row.age}</td>
              <td className="p-3">{row.gender}</td>
              <td className="p-3">{row.address}</td>
              <td className="p-3">{row.mobile}</td>
              <td className="p-3">{row.department}</td>
              <td className="p-3">{row.date}</td>
              <td className="p-3">{row.time}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientAppointmentTable;
