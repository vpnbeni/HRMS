const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const auth = require('../middleware/auth');

// Get all leaves
router.get('/', auth, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'firstName lastName email position')
      .sort({ startDate: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaves for a specific employee
router.get('/employee/:employeeId', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName email position')
      .sort({ startDate: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new leave request
router.post('/', auth, async (req, res) => {
  try {
    // Check if employee is present today
    const Attendance = require('../models/Attendance');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.findOne({
      employee: req.body.employee,
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'present'
    });

    if (!todayAttendance) {
      return res.status(400).json({ 
        message: 'Only employees who are present today can apply for leaves.' 
      });
    }

    const leave = new Leave({
      employee: req.body.employee,
      type: req.body.type,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      status: req.body.status || 'pending',
      totalDays: req.body.totalDays,
      createdBy: req.body.createdBy,
      approvedBy: req.body.approvedBy
    });

    const newLeave = await leave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a leave request
router.put('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update fields
    leave.employee = req.body.employee || leave.employee;
    leave.type = req.body.type || leave.type;
    leave.startDate = req.body.startDate || leave.startDate;
    leave.endDate = req.body.endDate || leave.endDate;
    leave.reason = req.body.reason || leave.reason;
    leave.status = req.body.status || leave.status;
    leave.totalDays = req.body.totalDays || leave.totalDays;
    if (req.body.approvedBy) leave.approvedBy = req.body.approvedBy;

    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a leave request (PATCH for status updates)
router.patch('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    Object.keys(req.body).forEach(key => {
      leave[key] = req.body[key];
    });

    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a leave request
router.delete('/:id', auth, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
