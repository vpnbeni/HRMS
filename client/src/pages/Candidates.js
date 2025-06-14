import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Candidates.css';
import CandidateFilters from '../components/candidates/CandidateFilters';
import CandidateTable from '../components/candidates/CandidateTable';
import CandidateForm from '../components/candidates/CandidateForm';
import EmployeeForm from '../components/employees/EmployeeForm';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#6c47b6' },
  { value: 'interviewed', label: 'Interviewed', color: '#ff9800' },
  { value: 'selected', label: 'Selected', color: '#4caf50' },
  { value: 'rejected', label: 'Rejected', color: '#e53935' },
];

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
  });
  const [employeeFormData, setEmployeeFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    profileUrl: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef();
  const employeeFormRef = useRef();
  const statusDropdownRef = useRef();
  const actionMenuRef = useRef();

  useEffect(() => {
    fetchCandidates();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
    }
    if (employeeFormRef.current && !employeeFormRef.current.contains(event.target)) {
      setShowEmployeeForm(false);
    }
    if (
      statusDropdownRef.current &&
      !statusDropdownRef.current.contains(event.target) &&
      !event.target.closest('.status-pill-dropdown')
    ) {
      setStatusDropdownOpen(null);
    }
    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target) &&
      !event.target.closest('.action-menu-container')
    ) {
      setActionMenuOpen(null);
    }
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/candidates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume' && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.position &&
      formData.experience !== '' &&
      formData.resume instanceof File
    );
  };

  const isEmployeeFormValid = () => {
    return (
      employeeFormData.firstName &&
      employeeFormData.lastName &&
      employeeFormData.email &&
      employeeFormData.phone &&
      employeeFormData.position &&
      employeeFormData.department &&
      employeeFormData.joiningDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Adding candidate...');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post('http://localhost:5000/api/candidates', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.update(toastId, {
          render: 'Candidate added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        
        setShowForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          resume: null,
        });
        fetchCandidates();
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
      
      let errorMessage = 'Failed to add candidate. Please try again.';
      
      if (error.response?.data) {
        const { message, errorType } = error.response.data;
        
        switch (errorType) {
          case 'DUPLICATE_EMAIL':
            errorMessage = message;
            break;
          case 'VALIDATION_ERROR':
            errorMessage = message;
            break;
          case 'SERVER_ERROR':
            errorMessage = message;
            break;
          default:
            errorMessage = message || errorMessage;
        }
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!isEmployeeFormValid()) return;

    const toastId = toast.loading('Converting to employee...');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/candidates/${employeeFormData._id}/convert`, {
        department: employeeFormData.department,
        joiningDate: employeeFormData.joiningDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.update(toastId, {
        render: 'Candidate converted to employee successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      setShowEmployeeForm(false);
      setEmployeeFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joiningDate: '',
        profileUrl: ''
      });
      fetchCandidates();
    } catch (error) {
      console.error('Error converting candidate to employee:', error);
      
      let errorMessage = 'Failed to convert candidate to employee. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    const toastId = toast.loading('Updating status...');
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/candidates/${candidateId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.update(toastId, {
        render: 'Status updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      fetchCandidates();
      setStatusDropdownOpen(null);
    } catch (error) {
      console.error('Error updating candidate status:', error);
      
      let errorMessage = 'Failed to update status. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleConvertToEmployee = (candidate) => {
    setEmployeeFormData({
      _id: candidate._id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      department: '',
      joiningDate: '',
      profileUrl: ''
    });
    setShowEmployeeForm(true);
    setStatusDropdownOpen(null);
  };

  const handleDownloadResume = async (candidateId) => {
    const toastId = toast.loading('Downloading resume...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/candidates/${candidateId}/resume`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const filename = response.headers['content-disposition']?.split('filename=')[1] || `resume-${candidateId}.pdf`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.update(toastId, {
        render: 'Resume downloaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      
      let errorMessage = 'Failed to download resume. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }
    
    const toastId = toast.loading('Deleting candidate...');
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.update(toastId, {
        render: 'Candidate deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      
      let errorMessage = 'Failed to delete candidate. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || candidate.status === filterStatus;
    const matchesPosition = !filterPosition || candidate.position === filterPosition;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const uniquePositions = Array.from(new Set(candidates.map((c) => c.position)));

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="candidates-page">
      <CandidateFilters
        filterStatus={filterStatus}
        filterPosition={filterPosition}
        searchTerm={searchTerm}
        onStatusChange={setFilterStatus}
        onPositionChange={setFilterPosition}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowForm(true)}
        statusOptions={STATUS_OPTIONS}
        uniquePositions={uniquePositions}
      />

      <CandidateTable
        candidates={filteredCandidates}
        statusOptions={STATUS_OPTIONS}
        statusDropdownOpen={statusDropdownOpen}
        actionMenuOpen={actionMenuOpen}
        onStatusChange={handleStatusChange}
        onStatusDropdownToggle={setStatusDropdownOpen}
        onDownloadResume={handleDownloadResume}
        onDeleteCandidate={handleDeleteCandidate}
        onActionMenuToggle={setActionMenuOpen}
        onConvertToEmployee={handleConvertToEmployee}
        statusDropdownRef={statusDropdownRef}
        actionMenuRef={actionMenuRef}
      />

      {showForm && (
        <CandidateForm  
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          isFormValid={isFormValid()}
          isSubmitting={isSubmitting}
          formRef={formRef}
        />
      )}

      {showEmployeeForm && (
        <EmployeeForm
          formData={employeeFormData}
          onInputChange={handleEmployeeInputChange}
          onSubmit={handleEmployeeSubmit}
          onClose={() => setShowEmployeeForm(false)}
          isFormValid={isEmployeeFormValid()}
          formRef={employeeFormRef}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default Candidates;
