const Category = require('../models/Category');

// GET /api/categories - List all categories for the logged-in user
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { user_id: req.params.id } });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/categories - Create a new category
exports.createCategory = async (req, res) => {
  const { name, color_code } = req.body;

  try {
    const category = await Category.create({
      name,
      color_code,
      user_id: req.params.id
    });

    res.status(201).json({ success: true, message: "Category created", category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id - Update a category's name and/or color
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, color_code } = req.body;

  try {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.name = name || category.name;
    category.color_code = color_code || category.color_code;

    await category.save();

    res.status(200).json({ success: true, message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id - Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await category.destroy();

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
