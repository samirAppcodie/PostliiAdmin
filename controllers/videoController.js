const Video = require('../models/Videos');
const path = require('path');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Upload video and save info
exports.uploadVideo = async (req, res) => {
  try {
    // Set a longer timeout for the request to handle large uploads
    req.setTimeout(600000); // 10 minutes
    
    const { description, categoryId, title, titles: titlesStr } = req.body;

    if (!categoryId || categoryId.trim() === '') {
      return res.status(400).json({ message: 'Please select a valid category.' });
    }

    // Check if we have files in the request
    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded. Check file size limits.' });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID.' });
    }

    const videoFiles = req.files['videos'] || [];
    const thumbnailFiles = req.files['thumbnails'] || [];

    if (videoFiles.length === 0) {
      return res.status(400).json({ message: 'No video files uploaded.' });
    }

    // Make sure we have the same number of thumbnails as videos
    if (thumbnailFiles.length !== videoFiles.length) {
      return res.status(400).json({ 
        message: 'Number of thumbnails must match number of videos.',
        videoCount: videoFiles.length,
        thumbnailCount: thumbnailFiles.length
      });
    }

    // Handle titles: either array from batch or single/repeated from sequential
   // Handle titles: either array from batch or single/repeated from sequential
let videoTitles;
if (titlesStr) {
  try {
    videoTitles = JSON.parse(titlesStr);
    if (videoTitles.length !== videoFiles.length) {
      return res.status(400).json({ message: 'Titles array length mismatch with files.' });
    }
  } catch (e) {
    return res.status(400).json({ message: 'Invalid titles JSON format.' });
  }
} else {
  // Fallback: single title provided
  const baseTitle = title && title.trim() !== '' ? title.trim() : 'Untitled';

  // Count how many videos already exist with this base title
  const existingCount = await Video.countDocuments({
    title: { $regex: `^${baseTitle}( \\(\\d+\\))?$`, $options: 'i' }
  });

  // Generate new titles continuing from existing count
  videoTitles = videoFiles.map((_, idx) => {
    // First video keeps base title if it's not taken yet
    if (existingCount === 0 && idx === 0) {
      return baseTitle;
    }
    return `${baseTitle} (${existingCount + idx + 1})`;
  });
}


    console.log(`Processing ${videoFiles.length} videos with ${thumbnailFiles.length} thumbnails`);
    
    // Create video objects using pre-computed titles
    const videos = videoFiles.map((file, index) => {
      console.log(`Processing video ${index + 1}/${videoFiles.length}: ${file.originalname} (${file.size} bytes)`);
      console.log(`With thumbnail: ${thumbnailFiles[index].originalname} (${thumbnailFiles[index].size} bytes)`);
      console.log(`Title: ${videoTitles[index]}`);
      
      return {
        title: videoTitles[index],
        description,
        videoUrl: `/uploads/videos/${file.filename}`,
        thumbnailUrl: thumbnailFiles[index] ? `/uploads/videos/${thumbnailFiles[index].filename}` : null,
        category: categoryId,
        fileSize: file.size,
        originalName: file.originalname
      };
    });

    // Save videos to database with error handling for each video
    let savedVideos = [];
    let errors = [];
    
    // Process one video at a time to prevent memory issues
    for (let i = 0; i < videos.length; i++) {
      try {
        const savedVideo = await Video.create(videos[i]);
        savedVideos.push(savedVideo);
        console.log(`Successfully saved video ${i + 1}/${videos.length} to database`);
      } catch (err) {
        console.error(`Error saving video ${i + 1}/${videos.length}:`, err);
        errors.push({
          index: i,
          video: videos[i].originalName,
          title: videos[i].title,
          error: err.message
        });
      }
    }

    // Return appropriate response based on success/partial success
    if (savedVideos.length === 0 && errors.length > 0) {
      return res.status(500).json({ 
        message: 'Failed to save any videos', 
        errors 
      });
    } else if (errors.length > 0) {
      return res.status(207).json({ 
        message: 'Some videos were saved successfully, but others failed',
        savedCount: savedVideos.length,
        errorCount: errors.length,
        savedVideos,
        errors
      });
    }

    res.status(201).json(savedVideos);
  } catch (error) {
    console.error('Server error during video upload:', error);
    res.status(500).json({ 
      message: 'Server error processing upload', 
      error: error.message 
    });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('category', 'name').sort({ createdAt: -1 });

    const formattedVideos = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      categoryName: video.category ? video.category.name : 'Uncategorized',
      categoryId: video.category ? video.category._id : null
    }));

    res.json(formattedVideos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get videos by category
exports.getVideosByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const videos = await Video.find({ category: categoryId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    const formattedVideos = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      categoryName: video.category ? video.category.name : 'Uncategorized',
      categoryId: video.category ? video.category._id : null
    }));
    
    res.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent videos with limit
exports.getRecentVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 videos if limit not specified
    
    const videos = await Video.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const formattedVideos = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      categoryName: video.category ? video.category.name : 'Uncategorized',
      categoryId: video.category ? video.category._id : null,
      createdAt: video.createdAt
    }));
    
    res.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching recent videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get videos by category name
exports.getVideosByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Find the category by name (case-insensitive)
    const category = await Category.findOne({ name: { $regex: new RegExp('^' + categoryName + '$', 'i') } });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const videos = await Video.find({ category: category._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    const formattedVideos = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      categoryName: video.category ? video.category.name : 'Uncategorized',
      categoryId: video.category ? video.category._id : null
    }));
    
    res.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching videos by category name:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
