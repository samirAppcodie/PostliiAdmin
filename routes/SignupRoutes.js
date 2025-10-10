// const express = require('express');
// const { signupUser } = require('../controllers/signupController');
// const router = express.Router();

// // Route for user signup
// router.get('/signup', signupUser);

// module.exports = router;



const express = require('express');
const authMiddleware = require('../middleware/authenticateToken'); // Assuming you have one
const Signup = require('../models/signup');
const { signupUser, getAllSignups } = require('../controllers/signupController');
const router = express.Router();




// ✅ GET - to fetch all signup users
router.get('/signupall', getAllSignups);
router.delete('/signup/:id', authMiddleware , async (req, res) => {
    try {
      const user = await Signup.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
