import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/DoctorProfile.css';

function DoctorProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [degreeInput, setDegreeInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_name: '',
    specialization: '',
    phone: '',
    degrees: []
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'doctor') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchProfile(parsedUser);
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchProfile = async (parsedUser) => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors',
        { headers: { Authorization: `Bearer ${token}` } });
      const myProfile = res.data.find(d => d.email === parsedUser.email);
      if (myProfile) {
        setDoctorProfile(myProfile);
        const savedDegrees = myProfile.degrees
          ? myProfile.degrees.split(',').map(d => d.trim()).filter(d => d)
          : [];
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          department_name: myProfile.department_name || '',
          specialization: myProfile.specialization || '',
          phone: myProfile.phone || '',
          degrees: savedDegrees
        });
      }
      setLoading(false);
    } catch { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDegree = () => {
    const trimmed = degreeInput.trim();
    if (!trimmed) return;
    if (formData.degrees.includes(trimmed)) {
      setError('This degree is already added.');
      return;
    }
    setFormData({ ...formData, degrees: [...formData.degrees, trimmed] });
    setDegreeInput('');
    setError('');
  };

  const handleRemoveDegree = (deg) => {
    setFormData({ ...formData, degrees: formData.degrees.filter(d => d !== deg) });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!formData.name || !formData.specialization || !formData.phone) {
      setError('Name, specialization and phone are required.');
      return;
    }
    try {
      setSaving(true);
      await axios.put(`http://localhost:5000/api/doctors/${doctorProfile.id}`, {
        specialization: formData.specialization,
        phone: formData.phone,
        degrees: formData.degrees.join(', '),
        name: formData.name
      }, { headers: { Authorization: `Bearer ${token}` } });

      // Update localStorage with new name
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.name = formData.name;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setUser(storedUser);

      setSuccess('✅ Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName={user?.name} />
      <div className="dashboard-main">
        <p className="loading-text">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" userName={user?.name} />
      <div className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Profile</h1>
            <p className="dashboard-subtitle">View and update your profile details</p>
          </div>
          <button className="profile-back-btn" onClick={() => navigate('/doctor/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

        <div className="profile-container">

          {/* Avatar Card */}
          <div className="profile-avatar-card">
            <div className="profile-avatar-circle">
              {formData.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="profile-name">{formData.name}</h2>
            <p className="profile-role-badge">👨‍⚕️ Doctor</p>
            <p className="profile-dept">{formData.department_name}</p>
            <p className="profile-spec">{formData.specialization}</p>
            {formData.degrees.length > 0 && (
              <div className="profile-degrees-preview">
                {formData.degrees.map((deg, i) => (
                  <span key={i} className="degree-preview-tag">{deg}</span>
                ))}
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="profile-form-card">
            <h3 className="profile-form-title">Edit Profile Details</h3>

            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <div className="profile-form-grid">

              <div className="profile-form-group">
                <label className="profile-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="profile-input profile-input-disabled"
                  disabled
                />
                <small className="profile-hint">Email cannot be changed</small>
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Department</label>
                <input
                  type="text"
                  value={formData.department_name}
                  className="profile-input profile-input-disabled"
                  disabled
                />
                <small className="profile-hint">Department can only be changed by admin</small>
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Heart Specialist"
                  className="profile-input"
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-label">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="profile-input"
                />
              </div>

            </div>

            {/* Degrees Section */}
            <div className="degrees-section">
              <label className="profile-label">Educational Degrees</label>
              <div className="degree-input-row">
                <input
                  type="text"
                  value={degreeInput}
                  onChange={e => setDegreeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddDegree()}
                  placeholder="e.g. MBBS, MD, FCPS"
                  className="profile-input degree-input"
                />
                <button className="degree-add-btn" onClick={handleAddDegree}>
                  + Add
                </button>
              </div>
              <small className="profile-hint">Press Enter or click Add to add a degree</small>

              {formData.degrees.length > 0 && (
                <div className="degrees-tags">
                  {formData.degrees.map((deg, i) => (
                    <span key={i} className="degree-tag">
                      🎓 {deg}
                      <button
                        className="degree-remove-btn"
                        onClick={() => handleRemoveDegree(deg)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="profile-form-actions">
              <button className="profile-cancel-btn" onClick={() => navigate('/doctor/dashboard')}>
                Cancel
              </button>
              <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;