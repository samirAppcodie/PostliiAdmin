// routes/category.js
const express = require('express');
const Category = require('../models/Category');
const router = express.Router();
const { addCategory,deleteCategory } = require('../controllers/categoryController');


router.post('/', addCategory);

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', deleteCategory);


// router.get('/', (req, res) => {
//     res.send('');
// });


module.exports = router;
