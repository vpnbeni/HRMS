import React, { useRef } from 'react';
import PropTypes from 'prop-types';

const AttendanceForm = ({
  formData,
  employees,
  statusOptions,
  onSubmit,
  onChange,
  onClose,
  isEdit
}) => {
  const formRef = useRef(null);

  const isFormValid = () => {
    return (
      formData.employee &&
      formData.date &&
      formData.status &&
      formData.task &&
      formData.checkIn
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={formRef}>
        <div className="modal-header">
          <span>{isEdit ? 'Edit Attendance' : 'Add Attendance'}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>Employee<span>*</span></label>
              <select
                name="employee"
                value={formData.employee}
                onChange={onChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-form-group">
              <label>Date<span>*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>Check-in Time<span>*</span></label>
              <input
                type="time"
                name="checkIn"
                value={formData.checkIn || ''}
                onChange={onChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label>Status<span>*</span></label>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="modal-form-group">
              <label>Task<span>*</span></label>
              <input
                type="text"
                name="task"
                placeholder="Task"
                value={formData.task}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="modal-save-btn"
            disabled={!isFormValid()}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

AttendanceForm.propTypes = {
  formData: PropTypes.shape({
    employee: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    task: PropTypes.string.isRequired,
    checkIn: PropTypes.string.isRequired
  }).isRequired,
  employees: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired
  })).isRequired,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired
};

export default AttendanceForm;
