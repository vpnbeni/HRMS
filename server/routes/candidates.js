const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/resumes'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all candidates
router.get('/', auth, async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific candidate
router.get('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new candidate
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, experience } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }
    const candidate = new Candidate({
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      resume: req.file.path,
      createdBy: req.user.userId
    });
    const newCandidate = await candidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    // Handle duplicate email error specifically
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ 
        message: 'A candidate with this email address already exists.',
        errorType: 'DUPLICATE_EMAIL' 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed: ' + validationErrors.join(', '),
        errorType: 'VALIDATION_ERROR' 
      });
    }
    
    // Generic error handling
    res.status(500).json({ 
      message: 'An error occurred while creating the candidate. Please try again.',
      errorType: 'SERVER_ERROR' 
    });
  }
});

// Convert candidate to employee
router.post('/:id/convert', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (candidate.status !== 'selected') {
      return res.status(400).json({ message: 'Only selected candidates can be converted to employees' });
    }

    const { department } = req.body;
    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    // Create new employee with default values
    const employee = new Employee({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.position,
      role: candidate.position, // Set role same as position initially
      department,
      joiningDate: new Date(), // Use current date as joining date
      salary: 0, // Default salary that needs to be updated later
      emergencyContact: {
        name: "To be updated",
        relationship: "To be updated",
        phone: "To be updated"
      },
      createdBy: req.user.userId
    });

    const newEmployee = await employee.save();

    // Delete the candidate
    if (candidate.resume && fs.existsSync(candidate.resume)) {
      fs.unlinkSync(candidate.resume);
    }
    await Candidate.findByIdAndDelete(req.params.id);

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a candidate
router.patch('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    Object.keys(req.body).forEach(key => {
      candidate[key] = req.body[key];
    });

    const updatedCandidate = await candidate.save();
    res.json(updatedCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Download resume
router.get('/:id/resume', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    const resumePath = candidate.resume;
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    const filename = path.basename(resumePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    fs.createReadStream(resumePath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a candidate
router.delete('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Delete resume file if it exists
    if (candidate.resume && fs.existsSync(candidate.resume)) {
      fs.unlinkSync(candidate.resume);
    }

    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
