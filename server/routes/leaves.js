const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const auth = require('../middleware/auth');

// Get all leaves
router.get('/', auth, async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'firstName lastName email')
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
      .populate('employee', 'firstName lastName email')
      .sort({ startDate: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new leave request
router.post('/', auth, async (req, res) => {
  const leave = new Leave({
    employee: req.body.employee,
    type: req.body.type,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
    status: req.body.status || 'pending',
    approvedBy: req.body.approvedBy
  });

  try {
    const newLeave = await leave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a leave request
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
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    await leave.remove();
    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 