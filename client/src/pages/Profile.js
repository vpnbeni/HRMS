import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/Profile.css';
import API_BASE_URL from '../utils/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Clock
} from 'lucide-react';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: 'Human Resources',
    position: '',
    joinDate: '',
    bio: '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        department: user.department || 'Human Resources',
        position: user.position || '',
        joinDate: user.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh the user data in the context to reflect changes
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        department: user.department || 'Human Resources',
        position: user.position || '',
        joinDate: user.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Show loading state if user data is not yet available
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user?.avatar ? (
                  <img src={user.avatar} alt={formData.name} />
                ) : (
                  <span>{getInitials(formData.name)}</span>
                )}
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-basic-info">
                <h2>{formData.name}</h2>
                <p className="profile-position">{formData.position}</p>
                <p className="profile-department">{formData.department}</p>
                <div className="profile-status">
                  <Shield size={16} />
                  <span>Active</span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={loading}>
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.name}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.email}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.phone || 'Not provided'}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <MapPin size={18} />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.address || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Work Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>
                    <Briefcase size={18} />
                    Position
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.position || 'Not specified'}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <Shield size={18} />
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="Human Resources">Human Resources</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  ) : (
                    <span>{formData.department}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <Calendar size={18} />
                    Join Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{formData.joinDate ? new Date(formData.joinDate).toLocaleDateString() : 'Not specified'}</span>
                  )}
                </div>

                <div className="profile-field">
                  <label>
                    <Clock size={18} />
                    Years of Service
                  </label>
                  <span>
                    {formData.joinDate ? Math.floor((new Date() - new Date(formData.joinDate)) / (365.25 * 24 * 60 * 60 * 1000)) : 0} years
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Bio</h3>
              <div className="profile-bio">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p>{formData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">24</div>
              <div className="stat-label">Employees Managed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">156</div>
              <div className="stat-label">Candidates Reviewed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">98%</div>
              <div className="stat-label">Attendance Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Reports Generated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
