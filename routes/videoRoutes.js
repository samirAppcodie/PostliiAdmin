const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const videoController = require('../controllers/videoController');
const Video = require('../models/Videos');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video or image files are allowed'), false);
  }
};


// Set higher limits for file uploads
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB max file size
    fieldSize: 1024 * 1024 * 10 // 10MB for text fields
  }
});

router.post(
  '/videos',
  upload.fields([
    { name: 'videos', maxCount: 10 },
    { name: 'thumbnails', maxCount: 10 }
  ]),
  videoController.uploadVideo
);
router.get('/videos/category/:categoryId', videoController.getVideosByCategory);
router.get('/videos/category-name/:categoryName', videoController.getVideosByCategoryName);
router.get('/videos/recent', videoController.getRecentVideos);
router.get('/videos', videoController.getVideos);
router.delete('/videos/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
