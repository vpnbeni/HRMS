import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Employees.css';
import EmployeeFilters from '../components/employees/EmployeeFilters';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import API_BASE_URL from '../utils/api';

const POSITIONS = [
  'Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'
];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
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
  const [filterPosition, setFilterPosition] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();
  const actionMenuRef = useRef();

  useEffect(() => {
    fetchEmployees();
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleActionMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleActionMenuClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setShowForm(false);
      setEditId(null);
      setIsEditing(false);
    }
  };

  const handleActionMenuClickOutside = (event) => {
    if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
      setActionMenuOpen(null);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.position &&
      formData.department &&
      formData.joiningDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading(editId ? 'Updating employee...' : 'Adding employee...');

    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await axios.put(`${API_BASE_URL}/employees/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.update(toastId, {
          render: 'Employee updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await axios.post(`${API_BASE_URL}/employees`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.update(toastId, {
          render: 'Employee added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      }
      
      setShowForm(false);
      setEditId(null);
      setIsEditing(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joiningDate: '',
        profileUrl: ''
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      
      let errorMessage = `Failed to ${editId ? 'update' : 'add'} employee. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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

  const handleEdit = (employee) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joiningDate: employee.joiningDate?.slice(0, 10) || '',
      profileUrl: employee.profileUrl || ''
    });
    setEditId(employee._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
    const toastId = toast.loading('Deleting employee...');
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.update(toastId, {
        render: 'Employee deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      
      let errorMessage = 'Failed to delete employee. Please try again.';
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

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesPosition = !filterPosition || employee.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="employees-page">
      <EmployeeFilters
        filterPosition={filterPosition}
        searchTerm={searchTerm}
        onPositionChange={setFilterPosition}
        onSearchChange={setSearchTerm}
        positions={POSITIONS}
      />

      <EmployeeTable
        employees={filteredEmployees}
        actionMenuOpen={actionMenuOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onActionMenuToggle={setActionMenuOpen}
        actionMenuRef={actionMenuRef}
      />

      {showForm && (
        <EmployeeForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => { 
            setShowForm(false); 
            setEditId(null);
            setIsEditing(false);
          }}
          isFormValid={isFormValid()}
          isSubmitting={isSubmitting}
          formRef={formRef}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Employees;
