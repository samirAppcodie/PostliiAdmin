const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();

    return res.status(201).json({ message: 'Admin created successfully' });

  } catch (error) {
    console.error('Create Admin Error:', error.stack);  // Print full stack trace
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

