import React from 'react';
import PropTypes from 'prop-types';

const EmployeeFilters = ({ 
  filterPosition, 
  searchTerm, 
  onPositionChange, 
  onSearchChange,
  positions 
}) => {
  return (
    <div className="employees-controls">
      <div className="filters">
        <select
          className="filter-dropdown"
          value={filterPosition}
          onChange={(e) => onPositionChange(e.target.value)}
        >
          <option value="">Position</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
      <input
        className="search-bar"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

EmployeeFilters.propTypes = {
  filterPosition: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  positions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default EmployeeFilters;
