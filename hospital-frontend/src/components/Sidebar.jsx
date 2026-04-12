import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ role, userName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const menus = {
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
      { label: 'Departments', path: '/admin/departments', icon: '🏢' },
      { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
      
     
      { label: 'Doctor Schedule', path: '/admin/doctor-schedule', icon: '📅' },
      { label: 'Patients', path: '/admin/patients', icon: '🧑‍🦽' },
      { label: 'Appointments', path: '/admin/appointments', icon: '📅' },
    ],
    doctor: [
      { label: 'Dashboard', path: '/doctor/dashboard', icon: '🏠' },
      { label: 'My Appointments', path: '/doctor/appointments', icon: '📅' },
      { label: 'Patient List', path: '/doctor/patients', icon: '🧑‍🦽' },
    ],
    patient: [
      { label: 'Dashboard', path: '/patient/dashboard', icon: '🏠' },
      { label: 'Book Appointment', path: '/patient/book-appointment', icon: '📋' },
      { label: 'Appointment History', path: '/patient/history', icon: '🕓' },
    ],
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  const currentRole = user?.role || role || 'patient';
  const displayName = user?.name || userName || 'User';

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">✚</span>
        <span className="sidebar-logo-text">MediCare</span>
      </div>

      {/* User Info */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {displayName ? displayName[0].toUpperCase() : 'U'}
        </div>
        <div>
          <div className="sidebar-username">{displayName}</div>
          <div className="sidebar-email" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {user?.email || 'N/A'}
          </div>
          <div className="sidebar-role">
            {currentRole?.charAt(0).toUpperCase() + currentRole?.slice(1)}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menus[currentRole]?.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-logout">
        🚪 Logout
      </button>
    </div>
  );
}

export default Sidebar; 
