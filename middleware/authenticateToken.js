


// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];  // Check for Bearer token

//   if (!token) {
//     return res.status(401).json({ message: 'Access Denied. No Token Provided' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or Expired Token' });
//     }
//     req.user = user;  // Attach the decoded user to the request object
//     next();  // Proceed to the next middleware or route handler
//   });
// };

// module.exports = authenticateToken;  // Correct export of the authenticateToken function





// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model for fetching user details

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and extract the user ID from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
    const user = await User.findById(decoded.id); // Assuming token has user ID in the payload
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user details to the request object so it's accessible in your route
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication Error:', err);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
