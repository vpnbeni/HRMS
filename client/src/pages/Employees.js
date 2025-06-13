import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Employees.css';

const POSITIONS = [
  'Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'
];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    profileUrl: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const formRef = useRef();

  useEffect(() => {
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
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.position &&
      formData.department &&
      formData.joiningDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(`http://localhost:5000/api/employees/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joiningDate: '',
        profileUrl: ''
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joiningDate: employee.joiningDate?.slice(0, 10) || '',
      profileUrl: employee.profileUrl || ''
    });
    setEditId(employee._id);
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesPosition = !filterPosition || employee.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="employees-page">
      <div className="employees-controls">
        <select
          className="filter-dropdown"
          value={filterPosition}
          onChange={e => setFilterPosition(e.target.value)}
        >
          <option value="">Position</option>
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="add-employee-btn" onClick={() => { setShowForm(true); setEditId(null); }}>
          Add Employee
        </button>
      </div>

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center' }}>No employees found.</td></tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <div className="employee-avatar">
                      {employee.profileUrl ? (
                        <img src={employee.profileUrl} alt="profile" />
                      ) : (
                        <span>{employee.firstName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  </td>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : ''}</td>
                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setActionMenuOpen(employee._id === actionMenuOpen ? null : employee._id);
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {actionMenuOpen === employee._id && (
                        <div className="action-dropdown-menu">
                          <div
                            className="action-dropdown-item"
                            onClick={() => {
                              handleEdit(employee);
                              setActionMenuOpen(null);
                            }}
                          >
                            Edit
                          </div>
                          <div
                            className="action-dropdown-item delete"
                            onClick={() => {
                              handleDelete(employee._id);
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
              <span>{editId ? 'Edit Employee Details' : 'Add New Employee'}</span>
              <button className="modal-close" onClick={() => { setShowForm(false); setEditId(null); }}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Full Name<span>*</span></label>
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
              </div>
              <div className="modal-form-row">
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
                <div className="modal-form-group">
                  <label>Position<span>*</span></label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Position</option>
                    {POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Department<span>*</span></label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Date of Joining<span>*</span></label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
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

export default Employees; 