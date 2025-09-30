

const mongoose = require('mongoose');
const { adminDB } = require('../db'); 

const TemplateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  jsonFile: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  }
}, { timestamps: true });

// module.exports = mongoose.model('Template', TemplateSchema);
module.exports = adminDB.model('Template', TemplateSchema);
