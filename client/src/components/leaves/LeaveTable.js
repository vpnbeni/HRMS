import React from 'react';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const LeaveTable = ({ 
  leaves, 
  onEdit, 
  onDelete, 
  onStatusUpdate,
  statusDropdownOpen,
  setStatusDropdownOpen,
  actionMenuOpen,
  setActionMenuOpen,
  STATUS_OPTIONS
}) => {
  return (
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
          {leaves.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center' }}>No leave requests found.</td></tr>
          ) : (
            leaves.map((leave) => (
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
                  <StatusDropdown
                    item={leave}
                    status={leave.status}
                    onStatusUpdate={onStatusUpdate}
                    statusOptions={STATUS_OPTIONS}
                    isOpen={statusDropdownOpen === leave._id}
                    setIsOpen={(isOpen) => setStatusDropdownOpen(isOpen ? leave._id : null)}
                  />
                </td>
                <td>
                  {leave.documentUrl ? (
                    <a href={leave.documentUrl} target="_blank" rel="noopener noreferrer">View</a>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>
                  <ActionMenu
                    item={leave}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isOpen={actionMenuOpen === leave._id}
                    setIsOpen={(isOpen) => setActionMenuOpen(isOpen ? leave._id : null)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
