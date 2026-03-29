import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Login.css';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // TODO: Connect backend API later
    if (formData.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (formData.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-cross">✚</div>
          <h1 className="login-brand-name">MediCare</h1>
          <p className="login-brand-tagline">Hospital Management System</p>
          <div className="login-features">
            <div className="login-feature-item">✓ Manage Appointments Easily</div>
            <div className="login-feature-item">✓ Doctor & Patient Records</div>
            <div className="login-feature-item">✓ Department Management</div>
            <div className="login-feature-item">✓ Role-Based Access Control</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Login As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
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
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In →
            </button>
          </form>

          <p className="login-register-text">
            Don't have an account?{' '}
            <Link to="/register" className="login-register-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 
