
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const SignupUser = require('../models/signup');




// ✅ GET - All Signups
const getAllSignups = async (req, res) => {
  try {
    const users = await SignupUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all signups error:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

module.exports = {

  getAllSignups
};
