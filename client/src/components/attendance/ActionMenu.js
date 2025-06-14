import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ActionMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 130 // Adjust menu to align right
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="action-menu-container">
      <button
        ref={triggerRef}
        className="action-menu-btn"
        onClick={handleToggle}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </button>
      {isOpen && (
        <div
          ref={menuRef}
          className="action-dropdown-menu"
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          <div
            className="action-dropdown-item"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          >
            Edit
          </div>
          <div
            className="action-dropdown-item delete"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

ActionMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ActionMenu;
