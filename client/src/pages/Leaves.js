import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Leaves.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#ffb300' },
  { value: 'approved', label: 'Approved', color: '#4caf50' },
  { value: 'rejected', label: 'Rejected', color: '#e53935' }
];

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending',
    document: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    fetchLeaves();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
      setEditId(null);
    }
    setActionMenuOpen(null);
    setStatusDropdownOpen(null);
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves');
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to fetch leave requests');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const isFormValid = () => {
    return (
      formData.type &&
      formData.startDate &&
      formData.endDate &&
      formData.reason
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (editId) {
        await axios.put(`http://localhost:5000/api/leaves/${editId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/leaves', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowForm(false);
      setEditId(null);
      fetchLeaves();
      setFormData({
        type: '',
        startDate: '',
        endDate: '',
        reason: '',
        status: 'pending',
        document: null
      });
      toast.success('Leave request submitted successfully');
    } catch (error) {
      console.error('Error saving leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  const handleEdit = (leave) => {
    setFormData({
      type: leave.type,
      startDate: leave.startDate?.slice(0, 10) || '',
      endDate: leave.endDate?.slice(0, 10) || '',
      reason: leave.reason,
      status: leave.status,
      document: null
    });
    setEditId(leave._id);
    setShowForm(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}`, { status: newStatus });
      fetchLeaves();
      toast.success('Leave request status updated');
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast.error('Failed to update leave request status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      fetchLeaves();
      toast.success('Leave request deleted successfully');
    } catch (error) {
      console.error('Error deleting leave request:', error);
      toast.error('Failed to delete leave request');
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const employeeName = `${leave.employee.firstName} ${leave.employee.lastName}`.toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const approvedLeaves = leaves.filter(leave => leave.status === 'approved');

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="leaves-page">
      <div className="leaves-controls">
        <select
          className="filter-dropdown"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="add-leave-btn" onClick={() => { setShowForm(true); setEditId(null); }}>
          Add Leave
        </button>
      </div>
      <div className="leaves-main">
        <div className="leaves-table-container">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Docs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>No leave requests found.</td></tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <div className="employee-avatar">
                        {leave.employee.profileUrl ? (
                          <img src={leave.employee.profileUrl} alt="profile" />
                        ) : (
                          <span>{leave.employee.firstName?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                    </td>
                    <td>{leave.employee.firstName} {leave.employee.lastName}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <div className="status-pill-dropdown">
                        <button
                          className={`status-pill status-${leave.status}`}
                          style={{ borderColor: STATUS_OPTIONS.find(opt => opt.value === leave.status)?.color }}
                          onClick={e => {
                            e.stopPropagation();
                            setStatusDropdownOpen(leave._id === statusDropdownOpen ? null : leave._id);
                          }}
                        >
                          {STATUS_OPTIONS.find(opt => opt.value === leave.status)?.label || leave.status}
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        {statusDropdownOpen === leave._id && (
                          <div className="status-dropdown-menu">
                            {STATUS_OPTIONS.map(opt => (
                              <div
                                key={opt.value}
                                className="status-dropdown-item"
                                onClick={() => {
                                  handleStatusUpdate(leave._id, opt.value);
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
                    <td>
                      {leave.documentUrl ? (
                        <a href={leave.documentUrl} target="_blank" rel="noopener noreferrer">View</a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-menu-container">
                        <button
                          className="action-menu-btn"
                          onClick={e => {
                            e.stopPropagation();
                            setActionMenuOpen(leave._id === actionMenuOpen ? null : leave._id);
                          }}
                        >
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </button>
                        {actionMenuOpen === leave._id && (
                          <div className="action-dropdown-menu">
                            <div
                              className="action-dropdown-item"
                              onClick={() => {
                                handleEdit(leave);
                                setActionMenuOpen(null);
                              }}
                            >
                              Edit
                            </div>
                            <div
                              className="action-dropdown-item delete"
                              onClick={() => {
                                handleDelete(leave._id);
                                setActionMenuOpen(null);
                              }}
                            >
                              Delete
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
        <div className="leaves-calendar-container">
          <div className="calendar-card">
            <div className="calendar-header">Leave Calendar</div>
            {/* Placeholder for calendar UI - you can integrate a calendar library here */}
            <div className="calendar-placeholder">(Calendar UI Here)</div>
            <div className="approved-leaves-list">
              <div className="approved-leaves-title">Approved Leaves</div>
              {approvedLeaves.length === 0 ? (
                <div className="no-approved-leaves">No approved leaves.</div>
              ) : (
                approvedLeaves.map(leave => (
                  <div key={leave._id} className="approved-leave-item">
                    <div className="employee-avatar small">
                      {leave.employee.profileUrl ? (
                        <img src={leave.employee.profileUrl} alt="profile" />
                      ) : (
                        <span>{leave.employee.firstName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="approved-leave-info">
                      <div className="approved-leave-name">{leave.employee.firstName} {leave.employee.lastName}</div>
                      <div className="approved-leave-date">{new Date(leave.startDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container" ref={formRef}>
            <div className="modal-header">
              <span>{editId ? 'Edit Leave' : 'Add New Leave'}</span>
              <button className="modal-close" onClick={() => { setShowForm(false); setEditId(null); }}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Leave Type<span>*</span></label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Leave Type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                    <option value="maternity">Maternity Leave</option>
                    <option value="paternity">Paternity Leave</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Designation<span>*</span></label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={formData.designation || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Leave Date<span>*</span></label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Documents</label>
                  <input
                    type="file"
                    name="document"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group" style={{ flex: 2 }}>
                  <label>Reason<span>*</span></label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  />
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

export default Leaves; 