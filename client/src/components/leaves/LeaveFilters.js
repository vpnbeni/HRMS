import React from 'react';

const LeaveFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  searchTerm, 
  setSearchTerm,
  onAddClick,
  STATUS_OPTIONS 
}) => {
  return (
    <div className="leaves-controls">
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
      <button 
        className="add-leave-btn" 
        onClick={onAddClick}
      >
        Add Leave
      </button>
    </div>
  );
};

export default LeaveFilters;
