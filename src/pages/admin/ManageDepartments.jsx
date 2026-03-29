 
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageDepartments.css';

function ManageDepartments() {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Cardiology', description: 'Heart and blood vessel treatment' },
    { id: 2, name: 'Neurology', description: 'Brain and nervous system' },
    { id: 3, name: 'Orthopedics', description: 'Bones, joints and muscles' },
    { id: 4, name: 'Pediatrics', description: 'Medical care for children' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditItem(dept);
    setFormData({ name: dept.name, description: dept.description });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError('Department name is required.');
      return;
    }
    if (editItem) {
      setDepartments(departments.map(d =>
        d.id === editItem.id ? { ...d, ...formData } : d
      ));
    } else {
      const newDept = {
        id: departments.length + 1,
        name: formData.name,
        description: formData.description,
      };
      setDepartments([...departments, newDept]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" userName="Admin" />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Manage Departments</h1>
            <p className="dashboard-subtitle">Add, edit or remove hospital departments</p>
          </div>
          <button onClick={openAddModal} className="btn-add">
            + Add Department
          </button>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id} className="table-row">
                  <td>{index + 1}</td>
                  <td><strong>{dept.name}</strong></td>
                  <td>{dept.description}</td>
                  <td>
                    <button onClick={() => openEditModal(dept)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(dept.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {departments.length === 0 && (
            <div className="empty-state">No departments found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">
              {editItem ? 'Edit Department' : 'Add New Department'}
            </h3>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description..."
                className="form-input form-textarea"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-save">
                {editItem ? 'Update' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDepartments;