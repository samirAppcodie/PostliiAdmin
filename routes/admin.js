const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/admin/create-admin', adminController.createAdmin);

module.exports = router;
