import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Attendance.css';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: '#4caf50' },
  { value: 'absent', label: 'Absent', color: '#e53935' }
];

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    task: ''
  });
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
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

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendance');
      setAttendance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.employee &&
      formData.date &&
      formData.status &&
      formData.task
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/attendance/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/attendance', formData);
      }
      setShowForm(false);
      setEditId(null);
      fetchAttendance();
      setFormData({
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        task: ''
      });
    } catch (error) {
      console.error('Error saving attendance record:', error);
    }
  };

  const handleEdit = (record) => {
    setFormData({
      employee: record.employee._id,
      date: record.date?.slice(0, 10) || '',
      status: record.status,
      task: record.task || ''
    });
    setEditId(record._id);
    setShowForm(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/attendance/${id}`, { status: newStatus });
      fetchAttendance();
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}`);
      fetchAttendance();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
    }
  };

  const filteredAttendance = attendance.filter(record => {
    const employeeName = `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="attendance-page">
      <div className="attendance-controls">
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
        <button className="add-attendance-btn" onClick={() => { setShowForm(true); setEditId(null); }}>
          Add Attendance
        </button>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center' }}>No attendance records found.</td></tr>
            ) : (
              filteredAttendance.map((record) => (
                <tr key={record._id}>
                  <td>
                    <div className="employee-avatar">
                      {record.employee.profileUrl ? (
                        <img src={record.employee.profileUrl} alt="profile" />
                      ) : (
                        <span>{record.employee.firstName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  </td>
                  <td>{record.employee.firstName} {record.employee.lastName}</td>
                  <td>{record.employee.position}</td>
                  <td>{record.employee.department}</td>
                  <td>{record.task}</td>
                  <td>
                    <div className="status-pill-dropdown">
                      <button
                        className={`status-pill status-${record.status}`}
                        style={{ borderColor: STATUS_OPTIONS.find(opt => opt.value === record.status)?.color }}
                        onClick={e => {
                          e.stopPropagation();
                          setStatusDropdownOpen(record._id === statusDropdownOpen ? null : record._id);
                        }}
                      >
                        {STATUS_OPTIONS.find(opt => opt.value === record.status)?.label || record.status}
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {statusDropdownOpen === record._id && (
                        <div className="status-dropdown-menu">
                          {STATUS_OPTIONS.map(opt => (
                            <div
                              key={opt.value}
                              className="status-dropdown-item"
                              onClick={() => {
                                handleStatusUpdate(record._id, opt.value);
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
                    <div className="action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setActionMenuOpen(record._id === actionMenuOpen ? null : record._id);
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {actionMenuOpen === record._id && (
                        <div className="action-dropdown-menu">
                          <div
                            className="action-dropdown-item"
                            onClick={() => {
                              handleEdit(record);
                              setActionMenuOpen(null);
                            }}
                          >
                            Edit
                          </div>
                          <div
                            className="action-dropdown-item delete"
                            onClick={() => {
                              handleDelete(record._id);
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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container" ref={formRef}>
            <div className="modal-header">
              <span>{editId ? 'Edit Attendance' : 'Add Attendance'}</span>
              <button className="modal-close" onClick={() => { setShowForm(false); setEditId(null); }}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Employee<span>*</span></label>
                  <select
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Date<span>*</span></label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Status<span>*</span></label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Status</option>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Task<span>*</span></label>
                  <input
                    type="text"
                    name="task"
                    placeholder="Task"
                    value={formData.task}
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

export default Attendance; 