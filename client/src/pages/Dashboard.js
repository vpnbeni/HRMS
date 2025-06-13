import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalCandidates: 0,
    pendingLeaves: 0,
    presentToday: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p>{stats.totalEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <p>{stats.activeEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Candidates</h3>
            <p>{stats.totalCandidates}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Pending Leaves</h3>
            <p>{stats.pendingLeaves}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Present Today</h3>
            <p>{stats.presentToday}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/candidates'}>
            Add New Candidate
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/employees'}>
            Add New Employee
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/attendance'}>
            Mark Attendance
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/leaves'}>
            Manage Leaves
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 