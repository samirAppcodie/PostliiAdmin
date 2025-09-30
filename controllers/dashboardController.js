// controllers/dashboardController.js
const Signup = require('../models/signup');
const Template = require('../models/Template');
const Category = require('../models/Category');

exports.getDashboardData = async (req, res) => {
  try {
    // Fetching user count
    const signupCount = await Signup.countDocuments();

    // Fetching template count
    const templateCount = await Template.countDocuments();

    // Fetching category count
    const categoryCount = await Category.countDocuments();

    // Sending data for the dashboard
    res.json({
      signupCount,
      templateCount,
      categoryCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
