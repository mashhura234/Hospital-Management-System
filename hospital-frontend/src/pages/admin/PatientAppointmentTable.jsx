import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/PatientAppointmentTable.css';

function PatientAppointmentTable() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Getting token from localStorage (where you store it after login)
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.response?.data?.message || "Failed to load patient data.");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="p-10 text-center text-teal-600 font-bold">Loading Patient Data...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Hospital Patient Directory</h2>
          <p className="text-sm text-slate-500">Total Registered: {patients.length}</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
          Refresh List
        </button>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="p-4 rounded-tl-lg">Patient Name</th>
            <th className="p-4">Age</th>
            <th className="p-4">Gender</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4 rounded-tr-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="p-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-teal-100 text-teal-700 border border-teal-200">
                  {patient.name ? patient.name[0] : 'P'}
                </span>
                <span className="font-medium text-slate-700">{patient.name}</span>
              </td>
              <td className="p-4 text-slate-600">{patient.age}</td>
              <td className="p-4 text-slate-600 capitalize">{patient.gender}</td>
              <td className="p-4 text-slate-500 text-sm">{patient.email}</td>
              <td className="p-4 text-slate-500 font-mono text-xs">{patient.phone}</td>
              <td className="p-4 text-center">
                <button className="text-blue-600 hover:underline text-xs font-bold mr-3">Edit</button>
                <button className="text-red-600 hover:underline text-xs font-bold">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {patients.length === 0 && (
        <div className="p-10 text-center text-gray-400">No patients found in the database.</div>
      )}
    </div>
  );
}

export default PatientAppointmentTable;