import React from 'react';
import PropTypes from 'prop-types';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const AttendanceTable = ({ 
  attendance,
  onEdit,
  onDelete,
  onStatusUpdate,
  statusOptions 
}) => {
  return (
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
          {attendance.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center' }}>No attendance records found.</td></tr>
          ) : (
            attendance.map((record) => (
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
                  <StatusDropdown
                    currentStatus={record.status}
                    statusOptions={statusOptions}
                    onStatusUpdate={(newStatus) => onStatusUpdate(record._id, newStatus)}
                  />
                </td>
                <td>
                  <ActionMenu
                    onEdit={() => onEdit(record)}
                    onDelete={() => onDelete(record._id)}
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

AttendanceTable.propTypes = {
  attendance: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    employee: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      position: PropTypes.string,
      department: PropTypes.string,
      profileUrl: PropTypes.string
    }).isRequired,
    task: PropTypes.string,
    status: PropTypes.string.isRequired
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired
};

export default AttendanceTable;
