import React from 'react';
import PropTypes from 'prop-types';

const POSITIONS = [
  'Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'
];

const EmployeeForm = ({
  formData,
  onInputChange,
  onSubmit,
  onClose,
  isFormValid,
  formRef,
  isEditing
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={formRef}>
        <div className="modal-header">
          <span>{isEditing ? 'Edit Employee' : 'Convert to Employee'}</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                First Name<span>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label>
                Last Name<span>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                Email Address<span>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label>
                Phone Number<span>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                Position<span>*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={onInputChange}
                required
              >
                <option value="">Select Position</option>
                {POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div className="modal-form-group">
              <label>
                Department<span>*</span>
              </label>
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                Date of Joining<span>*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="modal-form-group">
              <label>Profile Picture URL</label>
              <input
                type="url"
                name="profileUrl"
                placeholder="Profile Picture URL"
                value={formData.profileUrl}
                onChange={onInputChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="modal-save-btn"
            disabled={!isFormValid}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

EmployeeForm.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    joiningDate: PropTypes.string.isRequired,
    profileUrl: PropTypes.string
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  formRef: PropTypes.object,
  isEditing: PropTypes.bool
};

export default EmployeeForm;
