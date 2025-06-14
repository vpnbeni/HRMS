import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const StatusDropdown = ({ 
  currentStatus, 
  isOpen, 
  onToggle, 
  onStatusSelect, 
  onConvertToEmployee,
  statusOptions,
  statusDropdownRef 
}) => {
  const currentStatusOption = statusOptions.find(opt => opt.value === currentStatus);
  const dropdownTriggerRef = useRef(null);

  useEffect(() => {
    if (isOpen && dropdownTriggerRef.current) {
      const dropdown = statusDropdownRef?.current?.querySelector('.status-dropdown-menu');
      if (dropdown) {
        dropdown.style.position = 'fixed';
        
        // Get the trigger button's position relative to the viewport
        const triggerRect = dropdownTriggerRef.current.getBoundingClientRect();
        
        // Calculate initial position
        const top = triggerRect.bottom + 5;
        let left = triggerRect.left;
        
        // Set initial position for width calculation
        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
        
        // Get dropdown dimensions after positioning
        const dropdownRect = dropdown.getBoundingClientRect();
        
        // Check for right edge overflow
        const viewportWidth = window.innerWidth;
        if (left + dropdownRect.width > viewportWidth) {
          left = triggerRect.right - dropdownRect.width;
        }
        
        // Check for bottom edge overflow
        const viewportHeight = window.innerHeight;
        const bottomSpace = viewportHeight - top;
        const topSpace = triggerRect.top;
        
        if (bottomSpace < dropdownRect.height && topSpace > bottomSpace) {
          // Position above if more space there
          dropdown.style.top = `${triggerRect.top - dropdownRect.height - 5}px`;
        }
        
        // Apply final left position
        dropdown.style.left = `${left}px`;
      }
    }
  }, [isOpen]);

  return (
    <div className="status-pill-dropdown" ref={statusDropdownRef}>
      <button
        ref={dropdownTriggerRef}
        className={`status-pill status-${currentStatus}`}
        style={{
          borderColor: currentStatusOption?.color
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {currentStatusOption?.label || currentStatus}
        <span className="dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <div className="status-dropdown-menu">
          {statusOptions.map((opt) => (
            <div
              key={opt.value}
              className="status-dropdown-item"
              onClick={() => {
                onStatusSelect(opt.value);
              }}
            >
              {opt.label}
            </div>
          ))}
          {currentStatus === 'selected' && (
            <>
              <div className="status-dropdown-divider" />
              <div
                className="status-dropdown-item convert-option"
                onClick={() => {
                  onConvertToEmployee();
                }}
              >
                Convert to Employee
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

StatusDropdown.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onStatusSelect: PropTypes.func.isRequired,
  onConvertToEmployee: PropTypes.func,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  statusDropdownRef: PropTypes.object
};

export default StatusDropdown;
