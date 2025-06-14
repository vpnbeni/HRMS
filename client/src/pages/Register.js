import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      toast.update(toastId, {
        render: 'Account created successfully! Please login to continue.',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      // Clear form data
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your inputs.';
      } else if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
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
            <label>Full name<span>*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address<span>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
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
              disabled={loading}
              required
            />
            <span
              className="toggle-password"
              onClick={() => !loading && setShowPassword((prev) => !prev)}
              tabIndex={0}
              style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <div className="form-group password-group">
            <label>Confirm Password<span>*</span></label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span
              className="toggle-password"
              onClick={() => !loading && setShowConfirmPassword((prev) => !prev)}
              tabIndex={0}
              style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
