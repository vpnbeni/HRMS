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
    const result = await Attendance.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's attendance with all employees
router.get('/today', auth, async (req, res) => {
  try {
    const Employee = require('../models/Employee');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all employees
    const employees = await Employee.find({}, 'firstName lastName email position department profileUrl');
    
    // Get today's attendance records
    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('employee', 'firstName lastName email position department profileUrl');

    // Create a map of employee attendance
    const attendanceMap = new Map();
    todayAttendance.forEach(record => {
      attendanceMap.set(record.employee._id.toString(), record);
    });

    // Combine employees with their attendance status
    const employeeAttendance = employees.map(employee => {
      const attendance = attendanceMap.get(employee._id.toString());
      return {
        employee,
        attendance: attendance || null,
        status: attendance ? attendance.status : 'absent'
      };
    });

    res.json(employeeAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update/create attendance for today
router.post('/bulk-update', auth, async (req, res) => {
  try {
    const { attendanceUpdates } = req.body; // Array of { employeeId, status }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const results = [];
    
    for (const update of attendanceUpdates) {
      const { employeeId, status } = update;
      
      // Find existing attendance record for today
      let attendance = await Attendance.findOne({
        employee: employeeId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (attendance) {
        // Update existing record
        attendance.status = status;
        await attendance.save();
        results.push({ employeeId, action: 'updated', attendance });
      } else if (status === 'present') {
        // Create new record only for present status
        const checkInTime = new Date();
        attendance = new Attendance({
          employee: employeeId,
          date: today,
          checkIn: { time: checkInTime },
          status,
          createdBy: req.user.id
        });
        await attendance.save();
        results.push({ employeeId, action: 'created', attendance });
      }
    }

    res.json({ message: 'Attendance updated successfully', results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employees who are present today
router.get('/present-employees', auth, async (req, res) => {
  try {
    const Employee = require('../models/Employee');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's present attendance records
    const presentAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'present'
    }).populate('employee', 'firstName lastName email position department profileUrl');

    // Extract employees from attendance records
    const presentEmployees = presentAttendance.map(record => record.employee);

    res.json(presentEmployees);
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
