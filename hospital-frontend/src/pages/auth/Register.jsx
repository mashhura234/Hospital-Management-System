import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    age: '',
    gender: 'male',
    department_id: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch departments for doctor registration
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.role === 'doctor' && !formData.department_id) {
      setError('Please select a department.');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Register in Users table
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      const userId = registerResponse.data.userId;

      // Step 2: Login to get token
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const token = loginResponse.data.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Step 3: Create profile based on role
      if (formData.role === 'patient') {
        await axios.post('http://localhost:5000/api/patients', {
          user_id: userId,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          phone: formData.phone,
        }, config);
      } else if (formData.role === 'doctor') {
        await axios.post('http://localhost:5000/api/doctors', {
          user_id: userId,
          department_id: parseInt(formData.department_id),
          specialization: 'General',
          phone: formData.phone,
        }, config);
      }

      setSuccess('Registration successful! Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
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
      <div className="register-right">
        <div className="register-card">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Fill in your details to register</p>

          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Register As *</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-input">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" placeholder="Enter Your Full Name"
                value={formData.name} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" name="email" placeholder="Enter Your Email"
                value={formData.email} onChange={handleChange} className="form-input" required />
            </div>

            {formData.role === 'patient' && (
              <div className="register-row" style={{ display: 'flex', gap: '10px' }}>
                <input type="number" name="age" placeholder="Age"
                  onChange={handleChange} className="form-input" />
                <select name="gender" onChange={handleChange} className="form-input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            )}

            {formData.role === 'doctor' && (
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select name="department_id" value={formData.department_id}
                  onChange={handleChange} className="form-input">
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" placeholder="e.g. 01XXXXXXXXX"
                value={formData.phone} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" name="password"
                placeholder="Use 6 Characters Password" onChange={handleChange}
                className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input type="password" name="confirmPassword"
                placeholder="Re-enter password" onChange={handleChange}
                className="form-input" required />
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;