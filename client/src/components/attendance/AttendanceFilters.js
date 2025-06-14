import React from 'react';
import PropTypes from 'prop-types';

const AttendanceFilters = ({ 
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions
}) => {
  return (
    <div className="attendance-controls">
      <div className="filter-controls">
        <select
          className="filter-dropdown"
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          className="search-bar"
          type="text"
          placeholder="Search employee"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="attendance-date">
        <span className="date-label">Today's Attendance - {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

AttendanceFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired
};

export default AttendanceFilters;
