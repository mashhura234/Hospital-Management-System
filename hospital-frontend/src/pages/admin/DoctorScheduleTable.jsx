import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed

function DoctorScheduleTable() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token from storage (assuming you store it there after login)
  const token = localStorage.getItem('token'); 

  // Axios instance with default headers for your protected routes
  const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust to your server port
    headers: { Authorization: `Bearer ${token}` }
  });

  // 1. Fetch all appointments (GET /api/appointments)
  // Per your routes, this requires verifyToken (Admin/Doctor)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await api.get('/appointments');
        setSchedules(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // 2. Handle Delete (DELETE /api/appointments/:id)
  // Per your routes, this requires verifyAdmin
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        setSchedules((prev) => prev.filter((item) => item._id !== id));
        alert('Appointment deleted successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Unauthorized: Admin access required');
      }
    }
  };

  // 3. Handle Edit (PUT /api/appointments/:id)
  // Per your routes, this is used to update status
  const handleEdit = (id) => {
    // You can redirect to an edit form or open a modal
    alert('Redirecting to status update for ID: ' + id);
  };

  if (loading) return <div className="p-5">Loading schedules...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Doctor Appointments</h2>
        <span className="text-sm text-gray-500">Total: {schedules.length}</span>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-blue-50 text-left">
            <th className="p-3">Patient Name</th> {/* Adjusted to match appointment context */}
            <th className="p-3">Doctor</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((item) => (
            <tr key={item._id || item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.patientName || 'N/A'}</td>
              <td className="p-3">{item.doctorName || 'N/A'}</td>
              <td className="p-3">{new Date(item.date).toLocaleString()}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status || 'Pending'}
                </span>
              </td>
              <td className="p-3 space-x-2">
                <button 
                  onClick={() => handleEdit(item._id || item.id)} 
                  className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Edit Status
                </button>
                <button 
                  onClick={() => handleDelete(item._id || item.id)} 
                  className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {schedules.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No appointments found.</p>
      )}
    </div>
  );
}

export default DoctorScheduleTable;