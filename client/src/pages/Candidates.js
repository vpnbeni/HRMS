
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Candidates.css';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: '#6c47b6' },
  { value: 'selected', label: 'Selected', color: '#4caf50' },
  { value: 'rejected', label: 'Rejected', color: '#e53935' },
];

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    fetchCandidates();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
    }
    setActionMenuOpen(null);
    setStatusDropdownOpen(null);
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume' && files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.position &&
      formData.experience !== '' &&
      formData.resume instanceof File
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('experience', formData.experience);
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await axios.post('http://localhost:5000/api/candidates', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.status === 200) {
        setShowForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          resume: null
        });
        fetchCandidates();
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/candidates/${candidateId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCandidates();
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const handleDownloadResume = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/candidates/${candidateId}/resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = (
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = !filterStatus || candidate.status === filterStatus;
    const matchesPosition = !filterPosition || candidate.position === filterPosition;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  // Unique positions for filter dropdown
  const uniquePositions = Array.from(new Set(candidates.map(c => c.position)));

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="candidates-page">
      <div className="candidates-controls">
        <div className="filters">
          <select
            className="filter-dropdown"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Status</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="filter-dropdown"
            value={filterPosition}
            onChange={e => setFilterPosition(e.target.value)}
          >
            <option value="">Position</option>
            {uniquePositions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="add-candidate-btn" onClick={() => setShowForm(true)}>
          Add Candidate
        </button>
      </div>

      <div className="candidates-table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Candidates Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center' }}>No candidates found.</td></tr>
            ) : (
              filteredCandidates.map((candidate, idx) => (
                <tr key={candidate._id}>
                  <td>{String(idx + 1).padStart(2, '0')}</td>
                  <td>{candidate.firstName} {candidate.lastName}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.position}</td>
                  <td>
                    <div className="status-pill-dropdown">
                      <button
                        className={`status-pill status-${candidate.status}`}
                        style={{ borderColor: STATUS_OPTIONS.find(opt => opt.value === candidate.status)?.color }}
                        onClick={e => {
                          e.stopPropagation();
                          setStatusDropdownOpen(candidate._id === statusDropdownOpen ? null : candidate._id);
                        }}
                      >
                        {STATUS_OPTIONS.find(opt => opt.value === candidate.status)?.label || candidate.status}
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {statusDropdownOpen === candidate._id && (
                        <div className="status-dropdown-menu">
                          {STATUS_OPTIONS.map(opt => (
                            <div
                              key={opt.value}
                              className="status-dropdown-item"
                              onClick={() => {
                                handleStatusChange(candidate._id, opt.value);
                                setStatusDropdownOpen(null);
                              }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{candidate.experience}{candidate.experience !== '0' ? '+' : ''}</td>
                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setActionMenuOpen(candidate._id === actionMenuOpen ? null : candidate._id);
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {actionMenuOpen === candidate._id && (
                        <div className="action-dropdown-menu">
                          <div
                            className="action-dropdown-item"
                            onClick={() => {
                              handleDownloadResume(candidate._id);
                              setActionMenuOpen(null);
                            }}
                          >
                            Download Resume
                          </div>
                          <div
                            className="action-dropdown-item delete"
                            onClick={() => {
                              handleDeleteCandidate(candidate._id);
                              setActionMenuOpen(null);
                            }}
                          >
                            Delete Candidate
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container" ref={formRef}>
            <div className="modal-header">
              <span>Add New Candidate</span>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>First Name<span>*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Last Name<span>*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Email Address<span>*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Phone Number<span>*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Position<span>*</span></label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Experience<span>*</span></label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Resume<span>*</span></label>
                  <div className="file-upload-group">
                    <input
                      type="file"
                      name="resume"
                      id="resume-upload"
                      onChange={handleInputChange}
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="resume-upload" className="file-upload-label">
                      {formData.resume ? formData.resume.name : 'Upload Resume'}
                      <span className="upload-icon">⇪</span>
                    </label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="modal-save-btn"
                disabled={!isFormValid()}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates; 