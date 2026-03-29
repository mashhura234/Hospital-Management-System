 
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/ManageDoctors.css';

function ManageDoctors() {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Kamal Hossain', department: 'Cardiology', specialization: 'Heart Specialist', phone: '01711000001' },
    { id: 2, name: 'Dr. Sara Islam', department: 'Neurology', specialization: 'Brain & Spine', phone: '01711000002' },
    { id: 3, name: 'Dr. Imran Ali', department: 'Orthopedics', specialization: 'Bone & Joint', phone: '01711000003' },
  ]);

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'];

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', department: '', specialization: '', phone: '' });
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditItem(null);
    setFormData({ name: '', department: '', specialization: '', phone: '' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setEditItem(doc);
    setFormData({ name: doc.name, department: doc.department, specialization: doc.specialization, phone: doc.phone });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.department) {
      setError('Name and Department are required.');
      return;
    }
    if (editItem) {
      setDoctors(doctors.map(d => d.id === editItem.id ? { ...d, ...formData } : d));
    } else {
      setDoctors([...doctors, { id: doctors.length + 1, ...formData }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
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
          <button onClick={openAddModal} className="btn-add">+ Add Doctor</button>
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr className="table-head-row">
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, i) => (
                <tr key={doc.id} className="table-row">
                  <td>{i + 1}</td>
                  <td>
                    <div className="doctor-name-cell">
                      <div className="doctor-avatar-sm">{doc.name[4]}</div>
                      <strong>{doc.name}</strong>
                    </div>
                  </td>
                  <td>{doc.department}</td>
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
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{editItem ? 'Edit Doctor' : 'Add New Doctor'}</h3>
            {error && <div className="error-box">{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Dr. Name" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} className="form-input">
                <option value="">-- Select Department --</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Heart Specialist" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="form-input" />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-save">{editItem ? 'Update' : 'Add Doctor'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDoctors;