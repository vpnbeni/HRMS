import React from 'react';
import PropTypes from 'prop-types';

const EmployeeTable = ({
  employees,
  actionMenuOpen,
  onEdit,
  onDelete,
  onActionMenuToggle,
  actionMenuRef
}) => {
  return (
    <div className="employees-table-container">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Sr no.</th>
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
          {employees.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center' }}>
                No employees found.
              </td>
            </tr>
          ) : (
            employees.map((employee, idx) => (
              <tr key={employee._id}>
                <td>{String(idx + 1).padStart(2, '0')}</td>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionMenuToggle(employee._id);
                      }}
                    >
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </button>
                    {actionMenuOpen === employee._id && (
                      <div className="action-dropdown-menu" ref={actionMenuRef}>
                        <div
                          className="action-dropdown-item"
                          onClick={() => {
                            onEdit(employee);
                            onActionMenuToggle(null);
                          }}
                        >
                          Edit
                        </div>
                        <div
                          className="action-dropdown-item delete"
                          onClick={() => {
                            onDelete(employee._id);
                            onActionMenuToggle(null);
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
  );
};

EmployeeTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      joiningDate: PropTypes.string.isRequired,
      profileUrl: PropTypes.string
    })
  ).isRequired,
  actionMenuOpen: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onActionMenuToggle: PropTypes.func.isRequired,
  actionMenuRef: PropTypes.object
};

export default EmployeeTable;
