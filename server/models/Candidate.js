const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  resume: {
    type: String, // URL or path to resume file
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'interviewed', 'selected', 'rejected'],
    default: 'pending'
  },
  interviewDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate; 