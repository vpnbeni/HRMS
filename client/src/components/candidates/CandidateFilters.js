import React from 'react';
import PropTypes from 'prop-types';

const CandidateFilters = ({ 
  filterStatus, 
  filterPosition, 
  searchTerm, 
  onStatusChange, 
  onPositionChange, 
  onSearchChange,
  onAddClick,
  statusOptions,
  uniquePositions 
}) => {
  return (
    <div className="candidates-controls">
      <div className="filters">
        <select
          className="filter-dropdown"
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Status</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className="filter-dropdown"
          value={filterPosition}
          onChange={(e) => onPositionChange(e.target.value)}
        >
          <option value="">Position</option>
          {uniquePositions.map((pos) => (
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
      <button className="add-candidate-btn" onClick={onAddClick}>
        Add Candidate
      </button>
    </div>
  );
};

CandidateFilters.propTypes = {
  filterStatus: PropTypes.string.isRequired,
  filterPosition: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  uniquePositions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CandidateFilters;
