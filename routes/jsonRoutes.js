const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authenticateToken');
const JsonModel = require('../models/JsonData');
const { uploadJson, getJsonData } = require('../controllers/jsonController');
const jsonController = require('../controllers/jsonController');
// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the uploads directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Add file filter to only accept JSON files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/json') {
        cb(null, true);
    } else {
        cb(new Error('Only JSON files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.get('/json-data', jsonController.getJsonData); // Correct usage of getJsonData from controller
router.get('/json-data/:id', async (req, res) => {
    try {
        const result = await jsonController.getJsonById(req, res);
        return result;
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// Wrap the upload middleware in a try-catch to handle multer errors
router.post('/json/upload-json', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json({ 
                    success: false,
                    message: 'File upload error', 
                    error: err.message 
                });
            } else {
                // An unknown error occurred
                return res.status(500).json({ 
                    success: false,
                    message: 'Unknown error occurred during file upload', 
                    error: err.message 
                });
            }
        }
        // No error, proceed to controller
        uploadJson(req, res, next);
    });
});
// Get all JSON entries
router.get('/json/all', jsonController.getJsonDataAll);
router.delete('/json/:id', authMiddleware, jsonController.deleteJsonById);
module.exports = router;
