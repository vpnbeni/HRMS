import React from 'react';

const ActionMenu = ({
  item,
  onEdit,
  onDelete,
  isOpen,
  setIsOpen
}) => {
  return (
    <div className="action-menu-container">
      <button
        className="action-menu-btn"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </button>
      {isOpen && (
        <div className="action-dropdown-menu">
          <div
            className="action-dropdown-item"
            onClick={() => {
              onEdit(item);
              setIsOpen(false);
            }}
          >
            Edit
          </div>
          <div
            className="action-dropdown-item delete"
            onClick={() => {
              onDelete(item._id);
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

export default ActionMenu;
