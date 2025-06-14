import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Layout.css";
import {
  ChartNoAxesColumnIncreasing,
  LogOutIcon,
  Sparkles,
  SparklesLogOutIcon,
  UserRoundPlus,
  Users,
  Bell,
  Mail,
  UserRound,
  ChevronDown,
  Settings,
  User,
} from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  console.log(user,'useruseruser')
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for user data to ensure navbar updates when user changes
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@hrms.com",
    position: "HR Manager",
    department: "Human Resources",
    avatar: null,
    id: "1"
  });

  // Sidebar menu structure with sections
  const menuSections = [
    {
      heading: "Recruitment",
      items: [
        { path: "/candidates", label: "Candidates", icon: <UserRoundPlus /> },
      ],
    },
    {
      heading: "Organization",
      items: [
        { path: "/employees", label: "Employees", icon: <Users /> },
        {
          path: "/attendance",
          label: "Attendance",
          icon: <ChartNoAxesColumnIncreasing />,
        },
        { path: "/leaves", label: "Leaves", icon: <Sparkles /> },
      ],
    },
  ];

  // Sidebar search state
  const [sidebarSearch, setSidebarSearch] = useState("");
  
  // User dropdown state
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Update userData when user changes
  useEffect(() => {
    setUserData({
      name: user?.name || "John Doe",
      email: user?.email || "john.doe@hrms.com",
      position: user?.position || "HR Manager",
      department: user?.department || "Human Resources",
      avatar: user?.avatar || null,
      id: user?.id || user?.userId || "1"
    });
  }, [user]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="layout">
      <aside className="sidebar new-sidebar">
        <div className="sidebar-logo-search">
          <div className="sidebar-logo">
            {/* Placeholder for logo */}
            <div className="logo-box" />
            <div className="logo-text">
              <h2>LOGO</h2>
            </div>
          </div>
          <input
            className="sidebar-search-input"
            type="text"
            placeholder="Search"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
          />
        </div>
        <nav className="sidebar-nav new-sidebar-nav">
          {menuSections.map((section, idx) => (
            <div key={section.heading} className="sidebar-section">
              <div className="sidebar-section-heading">{section.heading}</div>
              {section.items.map((item) => (
                <button
                  key={item.path}
                  className={`nav-item new-nav-item `}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={`nav-item-active ${
                      isActive(item.path) ? "active" : ""
                    }`}
                  ></div>

                  <span className={`sidebar-icon icon-${item.icon}`}>
                    {item.icon}
                  </span>
                  <span className="label">{item.label}</span>
                </button>
              ))}
              {idx < menuSections.length - 1 && (
                <div className="sidebar-divider" />
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer new-sidebar-footer">
          <button className="logout-btn new-logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon icon-logout">
              <LogOutIcon />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="header new-header">
          <div className="header-right new-header-right">
            <button className="header-icon">
              <Bell size={24} />
              <span className="notification-badge">3</span>
            </button>
            <button className="header-icon">
              <Mail size={24} />
              <span className="notification-badge">5</span>
            </button>
            <div className="user-dropdown-container" ref={userDropdownRef}>
              <button
                className="header-avatar"
                onClick={toggleUserDropdown}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: '#e0d3f7', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6c47b6'
                  }}>
                    {getInitials(userData.name)}
                  </div>
                )}
                <ChevronDown size={20} />
              </button>
              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      {userData.avatar ? (
                        <img src={userData.avatar} alt={userData.name} />
                      ) : (
                        <span>{getInitials(userData.name)}</span>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{userData.name}</div>
                      <div className="user-email">{userData.email}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item" onClick={() => {
                    navigate('/profile');
                    setIsUserDropdownOpen(false);
                  }}>
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button className="user-dropdown-item" onClick={() => {
                    navigate('/settings');
                    setIsUserDropdownOpen(false);
                  }}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item logout-item" onClick={() => {
                    handleLogout();
                    setIsUserDropdownOpen(false);
                  }}>
                    <LogOutIcon size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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
