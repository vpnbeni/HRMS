import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const StatusDropdown = ({ currentStatus, statusOptions, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const currentOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onStatusUpdate(option.value);
    setIsOpen(false);
  };

  return (
    <div className="status-pill-dropdown">
      <button
        ref={triggerRef}
        className={`status-pill status-${currentStatus}`}
        style={{ borderColor: currentOption.color }}
        onClick={handleToggle}
      >
        {currentOption.label}
        <span className="dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="status-dropdown-menu"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {statusOptions.map(option => (
            <div
              key={option.value}
              className="status-dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

StatusDropdown.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  onStatusUpdate: PropTypes.func.isRequired
};

export default StatusDropdown;
