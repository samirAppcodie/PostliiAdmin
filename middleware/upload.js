// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Storage configuration for uploaded files (Profile image and templates)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true }); // Create uploads folder if it doesn't exist
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|gif|json/; // Allowed file types (images and JSON)
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       return cb(null, true);  // Allow the file to be uploaded
//     }

//     // Enhanced error handling for unsupported file types
//     cb(new Error('Only image and JSON files are allowed! Supported formats: jpeg, jpg, png, gif, json.'));
//   }
// });

// module.exports = upload;




// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where files will be uploaded
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on the current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer to accept a single file upload with 'file' as the field name
const upload = multer({ storage }).single('file');

module.exports = upload;
