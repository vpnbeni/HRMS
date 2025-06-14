import React from 'react';
import PropTypes from 'prop-types';
import StatusDropdown from './StatusDropdown';
import ActionMenu from './ActionMenu';

const CandidateTable = ({
  candidates,
  statusOptions,
  statusDropdownOpen,
  actionMenuOpen,
  onStatusChange,
  onStatusDropdownToggle,
  onDownloadResume,
  onDeleteCandidate,
  onActionMenuToggle,
  onConvertToEmployee,
  statusDropdownRef,
  actionMenuRef
}) => {
  return (
    <div className="candidates-table-container">
      <table className="candidates-table">
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Candidates Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                No candidates found.
              </td>
            </tr>
          ) : (
            candidates.map((candidate, idx) => (
              <tr key={candidate._id}>
                <td>{String(idx + 1).padStart(2, '0')}</td>
                <td>{candidate.firstName} {candidate.lastName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.position}</td>
                <td>
                  <StatusDropdown
                    currentStatus={candidate.status}
                    isOpen={statusDropdownOpen === candidate._id}
                    onToggle={() => onStatusDropdownToggle(candidate._id)}
                    onStatusSelect={(status) => onStatusChange(candidate._id, status)}
                    onConvertToEmployee={() => onConvertToEmployee(candidate)}
                    statusOptions={statusOptions}
                    statusDropdownRef={statusDropdownRef}
                  />
                </td>
                <td>
                  {candidate.experience}
                  {candidate.experience !== '0' ? '+' : ''}
                </td>
                <td>
                  <ActionMenu
                    isOpen={actionMenuOpen === candidate._id}
                    onToggle={() => onActionMenuToggle(candidate._id)}
                    onDownload={() => onDownloadResume(candidate._id)}
                    onDelete={() => onDeleteCandidate(candidate._id)}
                    actionMenuRef={actionMenuRef}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

CandidateTable.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired
    })
  ).isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  statusDropdownOpen: PropTypes.string,
  actionMenuOpen: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  onStatusDropdownToggle: PropTypes.func.isRequired,
  onDownloadResume: PropTypes.func.isRequired,
  onDeleteCandidate: PropTypes.func.isRequired,
  onActionMenuToggle: PropTypes.func.isRequired,
  onConvertToEmployee: PropTypes.func.isRequired,
  statusDropdownRef: PropTypes.object,
  actionMenuRef: PropTypes.object
};

export default CandidateTable;
