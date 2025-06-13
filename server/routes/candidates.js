const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

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

// Delete a candidate
router.delete('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await candidate.remove();
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 