import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const ActionMenu = ({
  isOpen,
  onToggle,
  onDownload,
  onDelete,
  actionMenuRef,
}) => {
  const menuTriggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !menuTriggerRef.current.contains(e.target)
      ) {
        onToggle(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen && menuTriggerRef.current) {
      const menu = dropdownRef.current;
      if (menu) {
        const triggerRect = menuTriggerRef.current.getBoundingClientRect();

        // Calculate position
        const top = triggerRect.bottom + 5;
        const right = window.innerWidth - triggerRect.right;

        // Position relative to trigger
        menu.style.position = "fixed";
        menu.style.top = `${top}px`;
        menu.style.right = `${right}px`;
      }
    }
  }, [isOpen]);

  return (
    <div className="action-menu-container" ref={actionMenuRef}>
      <button
        ref={menuTriggerRef}
        className="action-menu-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOpen);
        }}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </button>
      {isOpen && (
        <div className="action-dropdown-menu" ref={dropdownRef}>
          <div
            className="action-dropdown-item"
            onClick={() => {
              onDownload();
              onToggle(false);
            }}
          >
            Download Resume
          </div>
          <div
            className="action-dropdown-item delete"
            onClick={() => {
              onDelete();
              onToggle(false);
            }}
          >
            Delete Candidate
          </div>
        </div>
      )}
    </div>
  );
};

ActionMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  actionMenuRef: PropTypes.object,
};

export default ActionMenu;
