import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageDoctors.css';

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ department_id: '', specialization: '', phone: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors',
        { headers: { Authorization: `Bearer ${token}` } });
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {}
  };

  const openEditModal = (doc) => {
    setEditItem(doc);
    setFormData({
      department_id: doc.department_id || '',
      specialization: doc.specialization,
      phone: doc.phone
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.specialization || !formData.phone) {
      setError('All fields are required.');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/doctors/${editItem.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try {
        await axios.delete(`http://localhost:5000/api/doctors/${id}`,
          { headers: { Authorization: `Bearer ${token}` } });
        fetchDoctors();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Doctors</h1>
            <p className="dashboard-subtitle">Add, edit or remove doctors</p>
          </div>
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr className="table-head-row">
                  <th>#</th><th>Name</th><th>Department</th>
                  <th>Specialization</th><th>Phone</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={doc.id} className="table-row">
                    <td>{i + 1}</td>
                    <td>
                      <div className="doctor-name-cell">
                        <div className="doctor-avatar-sm">{doc.name?.[0]}</div>
                        <strong>{doc.name}</strong>
                      </div>
                    </td>
                    <td>{doc.department_name}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.phone}</td>
                    <td>
                      <button onClick={() => openEditModal(doc)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(doc.id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && <div className="empty-state">No doctors found.</div>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Edit Doctor</h3>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select name="department_id" value={formData.department_id}
                onChange={handleChange} className="form-input">
                <option value="">-- Select Department --</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={formData.phone}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-save">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDoctors;