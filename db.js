

const mongoose = require('mongoose');
require('dotenv').config(); // Load env vars

// Admin DB
const adminDB = mongoose.createConnection(process.env.ADMIN_DB_URI, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // 30 seconds timeout
});

// Login DB
const loginDB = mongoose.createConnection(process.env.LOGIN_DB_URI, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // 30 seconds timeout
});

adminDB.on('connected', () => console.log('✅ Connected to Admin DB'));
adminDB.on('error', (err) => console.error('Admin DB Connection Error:', err));

loginDB.on('connected', () => console.log('✅ Connected to Login DB'));
loginDB.on('error', (err) => console.error('Login DB Connection Error:', err));

module.exports = { adminDB, loginDB };
