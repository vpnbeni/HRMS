import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';
import { ChartNoAxesColumnIncreasing, LogOutIcon, Sparkles, SparklesLogOutIcon , UserRoundPlus, Users, Bell, Mail, UserRound, ChevronDown } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar menu structure with sections
  const menuSections = [
    { 
      heading: 'Recruitment',
      items: [
        { path: '/candidates', label: 'Candidates', icon: <UserRoundPlus /> },
      ],
     
    },
    {
      heading: 'Organization',
      items: [
        { path: '/employees', label: 'Employees', icon: <Users /> },
        { path: '/attendance', label: 'Attendance', icon: <ChartNoAxesColumnIncreasing /> },
        { path: '/leaves', label: 'Leaves', icon: <Sparkles /> },
      ],
    }
  ];

  // Sidebar search state
  const [sidebarSearch, setSidebarSearch] = useState('');

  const handleLogout = () => {
    logout();
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar new-sidebar">
        <div className="sidebar-logo-search">
          <div className="sidebar-logo">
            {/* Placeholder for logo */}
            <div className="logo-box" />
            <div className="logo-text">
              <h2 cla>LOGO</h2>
            </div>
          </div>
          <input
            className="sidebar-search-input"
            type="text"
            placeholder="Search"
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
          />
        </div>
        <nav className="sidebar-nav new-sidebar-nav">
          {menuSections.map((section, idx) => (
            <div key={section.heading} className="sidebar-section">
              <div className="sidebar-section-heading">{section.heading}</div>
              {section.items.map(item => (
                <button
                  key={item.path}
                  className={`nav-item new-nav-item `}
                  onClick={() => navigate(item.path)}
                >
                  <div className={`nav-item-active ${isActive(item.path) ? 'active' : ''}`}></div>

                  <span className={`sidebar-icon icon-${item.icon}`}>{item.icon}</span>
                  <span className="label">{item.label}</span>
                </button>
              ))}
              {idx < menuSections.length - 1 && <div className="sidebar-divider" />}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer new-sidebar-footer">
          <button className="logout-btn new-logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon icon-logout"> <LogOutIcon /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header new-header">
          <div className="header-search-bar-container">
            <input className="header-search-bar" type="text" placeholder="Search" />
          </div>
          <div className="header-right new-header-right">
            <button className="header-icon">
              <Bell size={24} />
              <span className="notification-badge">3</span>
            </button>
            <button className="header-icon">
              <Mail size={24} />
              <span className="notification-badge">5</span>
            </button>
            <div className="header-avatar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserRound size={32} />
              <ChevronDown size={20} />
            </div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 