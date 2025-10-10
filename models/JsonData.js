

const mongoose = require('mongoose');
const { adminDB } = require('../db'); 

const jsonDataSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('JsonData', jsonDataSchema);
module.exports = adminDB.model('JsonData', jsonDataSchema);