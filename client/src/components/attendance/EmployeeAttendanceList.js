import React from 'react';
import PropTypes from 'prop-types';
import StatusDropdown from './StatusDropdown';

const EmployeeAttendanceList = ({ 
  employeeAttendance,
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
            <th>Status</th>
            <th>Check-in Time</th>
          </tr>
        </thead>
        <tbody>
          {employeeAttendance.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center' }}>No employees found.</td></tr>
          ) : (
            employeeAttendance.map((record) => (
              <tr key={record.employee._id}>
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
                <td>
                  <StatusDropdown
                    currentStatus={record.status}
                    statusOptions={statusOptions}
                    onStatusUpdate={(newStatus) => onStatusUpdate(record.employee._id, newStatus)}
                  />
                </td>
                <td>
                  {record.attendance?.checkIn?.time ? 
                    new Date(record.attendance.checkIn.time).toLocaleTimeString('en-US', { 
                      hour12: false, 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 
                    '-'
                  }
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

EmployeeAttendanceList.propTypes = {
  employeeAttendance: PropTypes.arrayOf(PropTypes.shape({
    employee: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      position: PropTypes.string,
      department: PropTypes.string,
      profileUrl: PropTypes.string
    }).isRequired,
    attendance: PropTypes.object,
    status: PropTypes.string.isRequired
  })).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired
};

export default EmployeeAttendanceList;
