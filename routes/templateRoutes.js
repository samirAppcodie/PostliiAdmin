
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const templateController = require('../controllers/templateController');

// Multer configuration
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// ADD THIS FUNCTION
const imageFileFilter = (req, file, cb) => {
    // Use a regular expression to test for image file extensions
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        // Reject the file and pass an error message
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};


const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// Routes
router.get('/', templateController.getAllTemplates);
router.post('/', upload.array('images'), templateController.uploadTemplate);

router.delete('/:id', templateController.deleteTemplate);

// Serve uploaded images
// router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;
