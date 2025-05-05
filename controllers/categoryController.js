const Category = require('../models/Category');

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !image) return res.status(400).json({ error: 'Name and image required' });

    const category = await Category.create({ name, image });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const updatedCategories = categories.map(cat => ({
      ...cat._doc,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${cat.image}`
    }));
    res.json(updatedCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    const categoryWithUrl = {
      ...category._doc,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${category.image}`
    };

    res.json(categoryWithUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.image = req.file.filename; // Update image if new one is uploaded
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
