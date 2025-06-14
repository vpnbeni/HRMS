import React from 'react';
import PropTypes from 'prop-types';

const CandidateForm = ({
  formData,
  onInputChange,
  onSubmit,
  onClose,
  isFormValid,
  isSubmitting,
  formRef
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={formRef}>
        <div className="modal-header">
          <span>Add New Candidate</span>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                Position<span>*</span>
              </label>
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={onInputChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="modal-form-group">
              <label>
                Experience<span>*</span>
              </label>
              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={onInputChange}
                disabled={isSubmitting}
                required
                min="0"
              />
            </div>
          </div>
          <div className="modal-form-row">
            <div className="modal-form-group">
              <label>
                Resume<span>*</span>
              </label>
              <div className="file-upload-group">
                <input
                  type="file"
                  name="resume"
                  id="resume-upload"
                  onChange={onInputChange}
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume-upload" className={`file-upload-label ${isSubmitting ? 'disabled' : ''}`}>
                  {formData.resume ? formData.resume.name : 'Upload Resume'}
                  <span className="upload-icon">⇪</span>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="modal-save-btn"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

CandidateForm.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    resume: PropTypes.instanceOf(File)
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool,
  formRef: PropTypes.object
};

export default CandidateForm;
