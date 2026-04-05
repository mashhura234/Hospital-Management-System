import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    age: '',
    gender: 'male',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      // Step 1 — Register user
      const registerResponse = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      const userId = registerResponse.data.userId;

      // Step 2 — Login to get token
      const loginResponse = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = loginResponse.data.token;

      // Step 3 — Create profile based on role
      if (formData.role === 'patient') {
        await axios.post(
          'http://localhost:5000/api/patients',
          {
            user_id: userId,
            age: formData.age || 0,
            gender: formData.gender,
            phone: formData.phone,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (formData.role === 'doctor') {
        await axios.post(
          'http://localhost:5000/api/doctors',
          {
            user_id: userId,
            department_id: 1,
            specialization: 'General',
            phone: formData.phone,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Panel */}
      <div className="register-left">
        <div className="register-brand">
          <div className="register-cross">✚</div>
          <h1 className="register-brand-name">MediCare</h1>
          <p className="register-brand-tagline">Hospital Management System</p>
          <p className="register-side-text">
            Join our system as a Patient or Doctor.
            Get access to appointments, records, and more.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="register-right">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Fill in your details to register</p>

          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Register As *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="e.g. 01XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {formData.role === 'patient' && (
              <div className="register-row">
                <div className="form-group" style={{ flex: 1, marginRight: '10px' }}>
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="register-login-text">
            Already have an account?{' '}
            <Link to="/login" className="register-login-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;