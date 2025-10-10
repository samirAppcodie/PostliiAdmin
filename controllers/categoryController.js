const Category = require('../models/Category');
const Template = require('../models/Template');

exports.addCategory = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
  
      const newCategory = new Category({ name });
      await newCategory.save();
  
      res.status(201).json(newCategory); // Send the created category in the response
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('category/list', { categories });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getTemplatesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const templates = await Template.find({ category: categoryId }).populate('category');
    res.render('template/list', { templates });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};