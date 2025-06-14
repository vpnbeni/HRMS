import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Attendance.css';
import { useAuth } from '../context/AuthContext';
import EmployeeAttendanceList from '../components/attendance/EmployeeAttendanceList';
import AttendanceFilters from '../components/attendance/AttendanceFilters';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: '#4caf50' },
  { value: 'absent', label: 'Absent', color: '#e53935' }
];

const Attendance = () => {
  const { user } = useAuth();
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/attendance/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployeeAttendance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      toast.error('Failed to load attendance data');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (employeeId, newStatus) => {
    const toastId = toast.loading('Updating attendance...');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/attendance/bulk-update', {
        attendanceUpdates: [{ employeeId, status: newStatus }]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.update(toastId, {
        render: 'Attendance updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      // Update local state
      setEmployeeAttendance(prev => 
        prev.map(record => 
          record.employee._id === employeeId 
            ? { ...record, status: newStatus }
            : record
        )
      );
    } catch (error) {
      console.error('Error updating attendance:', error);
      
      let errorMessage = 'Failed to update attendance. Please try again.';
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

  const filteredEmployeeAttendance = employeeAttendance.filter(record => {
    const employeeName = `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="attendance-page">
      <AttendanceFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
      />

      <EmployeeAttendanceList 
        employeeAttendance={filteredEmployeeAttendance}
        onStatusUpdate={handleStatusUpdate}
        statusOptions={STATUS_OPTIONS}
      />
    </div>
  );
};

export default Attendance;
