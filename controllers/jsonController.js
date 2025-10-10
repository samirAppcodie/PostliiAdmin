const JsonData = require('../models/JsonData');
const fs = require('fs');
const path = require('path');

exports.uploadJson = async (req, res, next) => {
  try {
    // Check if file exists in the request
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Validate file type (should be JSON)
    if (req.file.mimetype !== 'application/json') {
      // Remove the uploaded file if it's not JSON
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file type. Only JSON files are allowed.' 
      });
    }

    // Save file URL to database
    const fileUrl = `uploads/${req.file.filename}`;
    const newFile = new JsonData({ fileUrl });
    await newFile.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded and URL saved successfully',
      fileUrl,
      fileId: newFile._id
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

exports.getJsonById = async (req, res) => {
  try {
    const id = req.params.id;
    const jsonData = await JsonData.findById(id);

    if (!jsonData) {
      return res.status(404).json({ 
        success: false, 
        message: 'JSON data not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: jsonData
    });
  } catch (err) {
    console.error('Error fetching JSON data by ID:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};
exports.getJsonData = async (req, res) => {
  try {
    console.log('Fetching JSON data from MongoDB...');
 
    const page = parseInt(req.query.page) || 0;
    const itemsPerPage = 10; // Increased from 1 to 10 for better pagination
 
    // MongoDB pagination (skip and limit)
    const jsonData = await JsonData.find()
      .skip(page * itemsPerPage)
      .limit(itemsPerPage);
 
    if (!jsonData || jsonData.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No JSON data found at this page' 
      });
    }
 
    // Get total count for pagination info
    const totalCount = await JsonData.countDocuments();
    const totalPages = Math.ceil(totalCount / itemsPerPage);
 
    res.status(200).json({
      success: true,
      data: jsonData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: itemsPerPage
      }
    });
  } catch (err) {
    console.error('Error fetching JSON data:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};


//dJson data
// exports.getJsonDataAll = async (req, res) => {
//   try {
//     console.log('Fetching all JSON data from MongoDB...');

//     const jsonData = await JsonData.find(); // No pagination

//     if (!jsonData || jsonData.length === 0) {
//       return res.status(404).json({ message: 'No JSON data found' });
//     }

//     res.json(jsonData);
//   } catch (err) {
//     console.error('Error fetching JSON data:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


exports.getJsonDataAll = async (req, res) => {
  try {
    console.log('Fetching all JSON data from MongoDB...');

    const jsonData = await JsonData.find(); // No pagination

    if (!jsonData || jsonData.length === 0) {
      return res.status(404).json({ message: 'No JSON data found' });
    }

    res.status(200).json({ success: true, data: jsonData });
    
  } catch (err) {
    console.error('Error fetching JSON data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteJsonById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if the JSON data exists
    const jsonData = await JsonData.findById(id);
    if (!jsonData) {
      return res.status(404).json({ success: false, message: 'JSON data not found' });
    }
    
    // Delete the file from the filesystem if it exists
    if (jsonData.fileUrl) {
      const filePath = path.join(__dirname, '..', jsonData.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Delete the record from the database
    await JsonData.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: 'JSON data deleted successfully' });
  } catch (err) {
    console.error('Error deleting JSON data:', err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
