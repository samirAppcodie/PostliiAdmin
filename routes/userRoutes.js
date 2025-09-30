
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // ✅ Required for delete route
const { getUsers } = require('../controllers/userController');
const bcrypt = require('bcryptjs');


// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Get all users (public and protected)
// router.get('/signup', userController.getAllUsers);
router.get('/users', userController.getAllUsers);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/profile', authenticateToken, (req, res) => {
  // Send the logged-in user's profile details (name, email, etc.)
  res.json({
    name: req.user.name,
    email: req.user.email,
    phone: req.user.mobile,
    company: req.user.company,
    address: req.user.address,
    profileImage: req.user.profileImage
  });
});




router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name'); // Select only name
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ name: user.name }); // ✅ This is what your frontend expects
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// routes/signup.js or controller file

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await SignupModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/add-user', authenticateToken, async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    // ✅ Only admin can add users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // ✅ Check if email already exists
    const existingUser = await SignupUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const newUser = new SignupUser({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully by admin' });
  } catch (error) {
    console.error('Admin Add User Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});





// Register new user with profile image
// router.post('/register', upload.single('profileImage'), userController.registerUser);

module.exports = router;
