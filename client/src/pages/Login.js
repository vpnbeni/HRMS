import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import API_BASE_URL from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-logo">
          <div className="logo-box" />
          <span>LOGO</span>
        </div>
        <div className="auth-dashboard-preview">
          <img src="/assets/dashboard-preview.png" alt="Dashboard Preview" />
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome to Dashboard</h2>
          <div className="form-group">
            <label>Email Address<span>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-group">
            <label>Password<span>*</span></label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="form-group form-links">
            <span className="forgot">Forgot password?</span>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading || !formData.email || !formData.password}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
