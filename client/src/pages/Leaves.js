import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Leaves.css";
import LeaveTable from "../components/leaves/LeaveTable";
import LeaveFilters from "../components/leaves/LeaveFilters";
import LeaveForm from "../components/leaves/LeaveForm";
import LeaveCalendar from "../components/leaves/LeaveCalendar";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#ffb300" },
  { value: "approved", label: "Approved", color: "#4caf50" },
  { value: "rejected", label: "Rejected", color: "#e53935" },
];

const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    employee: "",
    position: "",
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
    document: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leave requests");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.employee &&
      formData.type &&
      formData.startDate &&
      formData.endDate &&
      formData.reason
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading(editId ? 'Updating leave request...' : 'Submitting leave request...');

    try {
      const token = localStorage.getItem("token");

      // Prepare data - handle file upload if needed
      if (formData.document) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key !== "position" && formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });

        // Calculate total days
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        formDataToSend.append("totalDays", totalDays);
        
        // Add current user as createdBy
        if (user && (user.id || user.userId)) {
          formDataToSend.append("createdBy", user.id || user.userId);
        }

        if (editId) {
          await axios.put(
            `http://localhost:5000/api/leaves/${editId}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await axios.post("http://localhost:5000/api/leaves", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } else {
        // No file, send JSON
        // Calculate total days
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        const dataToSend = {
          employee: formData.employee,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          status: formData.status,
          totalDays: totalDays,
          createdBy: user?.id || user?.userId
        };
        
        console.log('Sending data:', dataToSend);
        console.log('Current user:', user);

        if (editId) {
          await axios.put(
            `http://localhost:5000/api/leaves/${editId}`,
            dataToSend,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          await axios.post("http://localhost:5000/api/leaves", dataToSend, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
      setShowForm(false);
      setEditId(null);
      fetchLeaves();
      setFormData({
        employee: "",
        position: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "pending",
        document: null,
      });
      
      toast.update(toastId, {
        render: editId ? 'Leave request updated successfully!' : 'Leave request submitted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error saving leave request:", error);
      
      let errorMessage = `Failed to ${editId ? 'update' : 'submit'} leave request. Please try again.`;
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

  const handleEdit = (leave) => {
    setFormData({
      employee: leave.employee._id,
      position: leave.employee.position,
      type: leave.type,
      startDate: leave.startDate?.slice(0, 10) || "",
      endDate: leave.endDate?.slice(0, 10) || "",
      reason: leave.reason,
      status: leave.status,
      document: null,
    });
    setEditId(leave._id);
    setShowForm(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const toastId = toast.loading('Updating status...');
    
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/leaves/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.update(toastId, {
        render: 'Leave request status updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      fetchLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
      
      let errorMessage = 'Failed to update leave request status. Please try again.';
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }
    
    const toastId = toast.loading('Deleting leave request...');
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/leaves/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.update(toastId, {
        render: 'Leave request deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave request:", error);
      
      let errorMessage = 'Failed to delete leave request. Please try again.';
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

  const filteredLeaves = leaves.filter((leave) => {
    const employeeName =
      `${leave.employee.firstName} ${leave.employee.lastName}`.toLowerCase();
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const approvedLeaves = leaves.filter((leave) => leave.status === "approved");

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="leaves-page">
      <LeaveFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddClick={() => {
          setShowForm(true);
          setEditId(null);
        }}
        STATUS_OPTIONS={STATUS_OPTIONS}
      />
      <div className="leaves-main">
        <LeaveTable
          leaves={filteredLeaves}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          statusDropdownOpen={statusDropdownOpen}
          setStatusDropdownOpen={setStatusDropdownOpen}
          actionMenuOpen={actionMenuOpen}
          setActionMenuOpen={setActionMenuOpen}
          STATUS_OPTIONS={STATUS_OPTIONS}
        />
        <LeaveCalendar approvedLeaves={approvedLeaves} />
      </div>
      {showForm && (
        <LeaveForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormValid={isFormValid}
          onClose={() => {
            setShowForm(false);
            setEditId(null);
          }}
          editId={editId}
        />
      )}
    </div>
  );
};

export default Leaves;
