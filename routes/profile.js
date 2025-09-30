const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/authenticateToken');

// GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update email and/or password
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;

    const updateFields = {};

    if (email) {
      // Check if email is already used by another user
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateFields.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
