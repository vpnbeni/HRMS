import React from 'react';

const StatusDropdown = ({ 
  item,
  status, 
  onStatusUpdate, 
  statusOptions,
  isOpen,
  setIsOpen 
}) => {
  return (
    <div className="status-pill-dropdown">
      <button
        className={`status-pill status-${status}`}
        style={{ borderColor: statusOptions.find(opt => opt.value === status)?.color }}
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {statusOptions.find(opt => opt.value === status)?.label || status}
        <span className="dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <div className="status-dropdown-menu">
          {statusOptions.map(opt => (
            <div
              key={opt.value}
              className="status-dropdown-item"
              onClick={() => {
                onStatusUpdate(item._id, opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
