import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageDepartments.css';

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDoctorsModal, setShowDoctorsModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptDoctors, setDeptDoctors] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const handleDeptClick = async (dept) => {
    setSelectedDept(dept);
    try {
      const res = await axios.get('http://localhost:5000/api/doctors',
        { headers: { Authorization: `Bearer ${token}` } });
      const filtered = res.data.filter(d => d.department_name === dept.name);
      setDeptDoctors(filtered);
      setShowDoctorsModal(true);
    } catch { setDeptDoctors([]); setShowDoctorsModal(true); }
  };

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditItem(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { setError('Department name is required.'); return; }
    try {
      if (editItem) {
        await axios.put(`http://localhost:5000/api/departments/${editItem.id}`,
          formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:5000/api/departments',
          formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department?')) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`,
          { headers: { Authorization: `Bearer ${token}` } });
        fetchDepartments();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed.');
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />
      <div className="dashboard-main">
        <div className="dept-header">
          <div>
            <h1>Hospital Departments</h1>
            <p>Manage medical units and clinical specializations</p>
          </div>
          <button className="add-dept-btn" onClick={openAddModal}>+ Add New Department</button>
        </div>

        {loading ? <p className="loading-text">Loading...</p> : (
          <div className="dept-grid">
            {departments.map((dept) => (
              <div key={dept.id} className="dept-card"
                onClick={() => handleDeptClick(dept)}
                style={{ cursor: 'pointer' }}>
                <div className="dept-card-info">
                  <div className="dept-icon">{dept.name.charAt(0)}</div>
                  <div className="dept-text">
                    <h3>{dept.name}</h3>
                    <p>{dept.description || 'No description provided.'}</p>
                  </div>
                </div>
                <div className="dept-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="edit-link" onClick={() => openEditModal(dept)}>Edit Details</button>
                  <button className="delete-link" onClick={() => handleDelete(dept.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{editItem ? 'Edit Department' : 'Add New Department'}</h3>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input type="text" name="name" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="form-input" placeholder="e.g. Cardiology" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" name="description" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="form-input" placeholder="Brief description" />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-save">{editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors in Department Modal */}
      {showDoctorsModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <h3 className="modal-title">Doctors in {selectedDept?.name}</h3>
            {deptDoctors.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr className="table-head-row">
                    <th>#</th><th>Name</th><th>Specialization</th><th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {deptDoctors.map((doc, i) => (
                    <tr key={doc.id} className="table-row">
                      <td>{i + 1}</td>
                      <td>{doc.name}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No doctors in this department yet.
              </p>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowDoctorsModal(false)} className="btn-cancel">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDepartments;