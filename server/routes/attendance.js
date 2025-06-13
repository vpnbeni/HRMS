const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

// Get all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('employee', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records for a specific employee
router.get('/employee/:employeeId', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new attendance record
router.post('/', auth, async (req, res) => {
  const attendance = new Attendance({
    employee: req.body.employee,
    date: req.body.date,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    status: req.body.status,
    workHours: req.body.workHours,
    notes: req.body.notes,
    createdBy: req.user.id
  });

  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance record
router.patch('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    Object.keys(req.body).forEach(key => {
      attendance[key] = req.body[key];
    });

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance record
router.delete('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.remove();
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 