const mongoose = require('mongoose');
const { adminDB } = require('../db');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  thumbnailUrl: {
  type: String
},

  createdAt: { type: Date, default: Date.now },
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true
    }
});

module.exports = adminDB.model('Video', videoSchema);
