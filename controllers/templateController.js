
const Template = require('../models/Template');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');  // Also make sure fs is imported



// Upload new template
exports.uploadTemplate = async (req, res) => {
  try {
    const { userId, categoryId } = req.body;
    const files = req.files; // Use req.files for multiple files

    if (!userId || !categoryId) {
      return res.status(400).json({ message: 'User ID and Category ID are required.' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    // Create a save promise for each file
    const templatePromises = files.map(file => {
      const newTemplate = new Template({
        userId,
        name: file.originalname, // Use original filename as the name
        image: `uploads/${file.filename}`,
        category: categoryId,
      });
      return newTemplate.save();
    });

    // Wait for all templates to be saved
    await Promise.all(templatePromises);

    res.status(201).json({ message: 'Templates uploaded successfully!' });

  } catch (err) {
    console.error('Error during template upload:', err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
};




exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    // Fix file path calculation
    const imagePath = path.join(__dirname, '../', template.image);

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting file:', err);
        // optionally respond with error or just log and continue
      }
    }

    await Template.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.getAllTemplates = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      // Find the category document by name
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      filter.category = categoryDoc._id;
    }

    const templates = await Template.find(filter).populate('category', 'name');

    const formattedTemplates = templates.map(template => ({
      _id: template._id,
      name: template.name,
      image: template.image,
      categoryName: template.category ? template.category.name : 'Uncategorized'
    }));

    res.json(formattedTemplates);
  } catch (err) {
    console.error('Error fetching templates:', err); // <--- Check your terminal for this log
    res.status(500).json({ message: 'Server error' });
  }
};