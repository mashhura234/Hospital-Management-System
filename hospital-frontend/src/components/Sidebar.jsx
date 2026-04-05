import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ role, userName }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = {
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
      { label: 'Departments', path: '/admin/departments', icon: '🏢' },
      { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
      { label: 'Add Doctor', path: '/admin/add-doctor', icon: '➕' },
      { label: 'Patient Appointments', path: '/admin/patient-appointments', icon: '🩺' },
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
    navigate('/login');
  };

  const currentMenu = menus[role] || menus['patient'];

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
          {userName ? userName[0].toUpperCase() : 'U'}
        </div>
        <div>
          <div className="sidebar-username">{userName || 'User'}</div>
          <div className="sidebar-role">
            {role?.charAt(0).toUpperCase() + role?.slice(1)}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {currentMenu.map((item) => {
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
