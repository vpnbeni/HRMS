import React, { useState, useRef } from 'react';
import '../styles/Payroll.css';

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid', color: '#4caf50' },
  { value: 'pending', label: 'Pending', color: '#ffb300' }
];

const mockPayrolls = [
  {
    _id: '1',
    employee: { firstName: 'Jane', lastName: 'Cooper', profileUrl: '' },
    department: 'Designer',
    position: 'Full Time',
    salary: 5000,
    deductions: 200,
    netPay: 4800,
    status: 'paid'
  },
  {
    _id: '2',
    employee: { firstName: 'Cody', lastName: 'Fisher', profileUrl: '' },
    department: 'Backend Development',
    position: 'Senior',
    salary: 7000,
    deductions: 500,
    netPay: 6500,
    status: 'pending'
  }
];

const Payroll = () => {
  const [payrolls, setPayrolls] = useState(mockPayrolls);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    department: '',
    position: '',
    salary: '',
    deductions: '',
    netPay: '',
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const formRef = useRef();

  const filteredPayrolls = payrolls.filter(payroll => {
    const employeeName = `${payroll.employee.firstName} ${payroll.employee.lastName}`.toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isFormValid = () => {
    return (
      formData.employee &&
      formData.department &&
      formData.position &&
      formData.salary &&
      formData.deductions &&
      formData.netPay
    );
  };

  return (
    <div className="payroll-page">
      <div className="payroll-controls">
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
        <button className="add-payroll-btn" onClick={() => { setShowForm(true); setEditId(null); }}>
          Add Payroll
        </button>
      </div>
      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center' }}>No payroll records found.</td></tr>
            ) : (
              filteredPayrolls.map((payroll) => (
                <tr key={payroll._id}>
                  <td>
                    <div className="employee-avatar">
                      {payroll.employee.profileUrl ? (
                        <img src={payroll.employee.profileUrl} alt="profile" />
                      ) : (
                        <span>{payroll.employee.firstName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  </td>
                  <td>{payroll.employee.firstName} {payroll.employee.lastName}</td>
                  <td>{payroll.department}</td>
                  <td>{payroll.position}</td>
                  <td>${payroll.salary}</td>
                  <td>${payroll.deductions}</td>
                  <td>${payroll.netPay}</td>
                  <td>
                    <div className="status-pill-dropdown">
                      <button
                        className={`status-pill status-${payroll.status}`}
                        style={{ borderColor: STATUS_OPTIONS.find(opt => opt.value === payroll.status)?.color }}
                        onClick={e => {
                          e.stopPropagation();
                          setStatusDropdownOpen(payroll._id === statusDropdownOpen ? null : payroll._id);
                        }}
                      >
                        {STATUS_OPTIONS.find(opt => opt.value === payroll.status)?.label || payroll.status}
                        <span className="dropdown-arrow">▼</span>
                      </button>
                      {statusDropdownOpen === payroll._id && (
                        <div className="status-dropdown-menu">
                          {STATUS_OPTIONS.map(opt => (
                            <div
                              key={opt.value}
                              className="status-dropdown-item"
                              onClick={() => {
                                // handleStatusUpdate(payroll._id, opt.value);
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
                          setActionMenuOpen(payroll._id === actionMenuOpen ? null : payroll._id);
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {actionMenuOpen === payroll._id && (
                        <div className="action-dropdown-menu">
                          <div className="action-dropdown-item">Edit</div>
                          <div className="action-dropdown-item">Download Payslip</div>
                          <div className="action-dropdown-item delete">Delete</div>
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
              <span>{editId ? 'Edit Payroll' : 'Add Payroll'}</span>
              <button className="modal-close" onClick={() => { setShowForm(false); setEditId(null); }}>×</button>
            </div>
            <form className="modal-form">
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Employee<span>*</span></label>
                  <input
                    type="text"
                    name="employee"
                    placeholder="Employee Name"
                    value={formData.employee}
                    onChange={e => setFormData({ ...formData, employee: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Department<span>*</span></label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Salary<span>*</span></label>
                  <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Deductions<span>*</span></label>
                  <input
                    type="number"
                    name="deductions"
                    placeholder="Deductions"
                    value={formData.deductions}
                    onChange={e => setFormData({ ...formData, deductions: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Net Pay<span>*</span></label>
                  <input
                    type="number"
                    name="netPay"
                    placeholder="Net Pay"
                    value={formData.netPay}
                    onChange={e => setFormData({ ...formData, netPay: e.target.value })}
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

export default Payroll; 