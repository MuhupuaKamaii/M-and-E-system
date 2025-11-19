import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiFileText,
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';

const OmaSideNav = () => {
  const { user, logout } = useAuth();

  // Get organization name from user
  const getOrganizationName = () => {
    if (user?.fullName) return user.fullName;
    return localStorage.getItem('fullName') || 'OMA User';
  };

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="ndp-logo">
            <span className="logo-text">NDP6</span>
            <span className="logo-subtitle">V2030</span>
          </div>
          <span className="system-label">M&E SYSTEM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/omaDashboard" className="nav-item">
          <FiHome className="nav-icon" />
          Dashboard
        </Link>
        <Link to="/project-submission" className="nav-item">
          <FiFileText className="nav-icon" />
          Planning
        </Link>
        <Link to="/reports" className="nav-item">
          <FiFileText className="nav-icon" />
          Reports
        </Link>
        <Link to="/analytics" className="nav-item">
          <FiBarChart2 className="nav-icon" />
          Analytics
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{getOrganizationName().charAt(0)}</div>
          <div className="user-details">
            <div className="user-name">{getOrganizationName()}</div>
            <div className="user-role">OMA User</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default OmaSideNav;
