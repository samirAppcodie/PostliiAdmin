
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, phone, password, company, address } = req.body;
//     const profileImage = req.file?.filename;

//     // Check if user already exists
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       company,
//       address,
//       profileImage
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });

//   } catch (err) {
//     console.error('Registration Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // controllers/userController.js
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
