const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ 
          message: 'An account with this email already exists. Please use a different email or try logging in.',
          errorType: 'DUPLICATE_EMAIL' 
        });
      }

      // Create new user
      user = new User({
        email,
        password,
        name
      });

      await user.save();

      // Generate JWT token with more user information
      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.position
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          department: user.department,
          position: user.position,
          joinDate: user.joinDate,
          bio: user.bio,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token with more user information
      const token = jwt.sign(
        { 
          userId: user._id, 
          role: user.role,
          name: user.name,
          email: user.email,
          department: user.department,
          position: user.position
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          department: user.department,
          position: user.position,
          joinDate: user.joinDate,
          bio: user.bio,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, 
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('department').optional().isIn(['Human Resources', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations']).withMessage('Invalid department'),
    body('position').optional().trim(),
    body('bio').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, address, department, position, bio } = req.body;
      
      // Check if email is already taken by another user
      if (email) {
        const existingUser = await User.findOne({ 
          email, 
          _id: { $ne: req.user.userId } 
        });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update user profile
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (department !== undefined) updateData.department = department;
      if (position !== undefined) updateData.position = position;
      if (bio !== undefined) updateData.bio = bio;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          department: user.department,
          position: user.position,
          joinDate: user.joinDate,
          bio: user.bio,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
