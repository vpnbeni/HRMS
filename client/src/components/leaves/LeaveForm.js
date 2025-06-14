import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/api';

const LeaveForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  isFormValid,
  onClose,
  editId
}) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(!editId);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Pre-fill employee name when editing
    if (editId && formData.employee) {
      const employee = employees.find(emp => emp._id === formData.employee);
      if (employee) {
        setSearchTerm(`${employee.firstName} ${employee.lastName}`);
        setShowEmployeeSearch(false);
      }
    }
  }, [editId, formData.employee, employees]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/attendance/present-employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching present employees:', error);
    }
  };

  const handleEmployeeSelect = (employee) => {
    handleInputChange({
      target: { 
        name: 'employee', 
        value: employee._id 
      }
    });
    handleInputChange({
      target: { 
        name: 'position', 
        value: employee.position 
      }
    });
    setSearchTerm(`${employee.firstName} ${employee.lastName}`);
    setShowEmployeeSearch(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <span>{editId ? 'Edit Leave' : 'Add New Leave'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>Employee (Present Today)<span>*</span></label>
              <input
                type="text"
                placeholder={employees.length === 0 ? "No employees are present today" : "Search present employees..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowEmployeeSearch(true);
                }}
                disabled={editId || employees.length === 0} // Disable employee selection when editing or no employees
                required
              />
              {employees.length === 0 && !editId && (
                <div className="no-present-employees-message">
                  <small style={{ color: '#e53935', fontSize: '0.9rem' }}>
                    Only employees who are marked as present today can apply for leaves. Please ensure employees are marked present in the Attendance section first.
                  </small>
                </div>
              )}
              {showEmployeeSearch && searchTerm && filteredEmployees.length > 0 && (
                <div className="employee-search-results">
                  {filteredEmployees.map(emp => (
                    <div 
                      key={emp._id} 
                      className="employee-search-item"
                      onClick={() => handleEmployeeSelect(emp)}
                    >
                      <div className="employee-avatar small">
                        {emp.profileUrl ? (
                          <img src={emp.profileUrl} alt="profile" />
                        ) : (
                          <span>{emp.firstName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        {emp.firstName} {emp.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showEmployeeSearch && searchTerm && filteredEmployees.length === 0 && employees.length > 0 && (
                <div className="employee-search-results">
                  <div className="no-results-message" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
                    No present employees found matching "{searchTerm}"
                  </div>
                </div>
              )}
            </div>
            <div className="modal-form-group">
              <label>Position<span>*</span></label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                readOnly
                required
              />
            </div>
          </div>
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
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div className="modal-form-group">
              <label>Start Date<span>*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>End Date<span>*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
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
            disabled={!isFormValid() || employees.length === 0}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
