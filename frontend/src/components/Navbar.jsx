import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, ListFilter, LogOut } from 'lucide-react';

/**
 * Top navigation bar with branding, navigation links, and user session management.
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <NavLink to="/dashboard" className="navbar-brand">
          <div className="navbar-brand-icon">
            <Briefcase size={20} />
          </div>
          <span>Job Application Tracker</span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <ListFilter size={17} />
            <span>Applications</span>
          </NavLink>
        </nav>

        {/* User Profile & Logout */}
        <div className="navbar-user">
          <div className="user-badge" title={user?.email}>
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>

          <button
            onClick={logout}
            className="btn-logout"
            title="Log out of your account"
            aria-label="Logout"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
