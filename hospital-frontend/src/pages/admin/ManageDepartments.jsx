import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ManageDepartments.css';

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Could not load departments. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/departments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (err) {
        alert("Error deleting department: " + (err.response?.data?.message || "Server error"));
      }
    }
  };

  if (loading) return <div className="dept-loader">Loading Departments...</div>;

  return (
    <div className="manage-dept-container">
      <div className="dept-header">
        <div>
          <h1>Hospital Departments</h1>
          <p>Manage medical units and clinical specializations</p>
        </div>
        <button className="add-dept-btn">+ Add New Department</button>
      </div>

      {error && <div className="dept-error-msg">{error}</div>}

      <div className="dept-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="dept-card">
            <div className="dept-card-info">
              <div className="dept-icon">
                {dept.name.charAt(0)}
              </div>
              <div className="dept-text">
                <h3>{dept.name}</h3>
                <p>{dept.description || "No description provided for this unit."}</p>
              </div>
            </div>
            <div className="dept-card-actions">
              <button className="edit-link">Edit Details</button>
              <button 
                className="delete-link" 
                onClick={() => handleDelete(dept.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && !error && (
        <div className="empty-state">No departments registered yet.</div>
      )}
    </div>
  );
}

export default ManageDepartments;