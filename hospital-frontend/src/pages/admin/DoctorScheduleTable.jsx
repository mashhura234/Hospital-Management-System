import React, { useState } from 'react';

const initialData = [
  { id: 1, name: 'Dr. Kamal Hossain', department: 'Cardiology', specialization: 'Heart Specialist', degree: 'MBBS, MD', available: '2026-04-03 10:00 AM' },
  { id: 2, name: 'Dr. Sara Islam', department: 'Neurology', specialization: 'Brain & Spine', degree: 'MBBS, MS', available: '2026-04-03 11:30 AM' },
  { id: 3, name: 'Dr. Imran Ali', department: 'Orthopedics', specialization: 'Bone & Joint', degree: 'MBBS', available: '2026-04-04 09:00 AM' },
];

function DoctorScheduleTable() {
  const [schedules, setSchedules] = useState(initialData);

  const handleDelete = (id) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    alert('Edit schedule functionality coming soon for ID: ' + id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Doctor Schedule</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-blue-50 text-left">
            <th className="p-3">Doctor Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Specialization</th>
            <th className="p-3">Degree</th>
            <th className="p-3">Available Date/Time</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.department}</td>
              <td className="p-3">{item.specialization}</td>
              <td className="p-3">{item.degree}</td>
              <td className="p-3">{item.available}</td>
              <td className="p-3 space-x-2">
                <button onClick={() => handleEdit(item.id)} className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {schedules.length === 0 && <p className="mt-2 text-gray-500">No schedule available.</p>}
    </div>
  );
}

export default DoctorScheduleTable;
