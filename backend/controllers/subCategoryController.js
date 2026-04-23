const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

// @desc    Get all sub-categories
// @route   GET /api/subcategories
// @access  Public
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate('category', 'name')
      .sort({ name: 1 });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sub-categories (including inactive) - Admin only
// @route   GET /api/subcategories/all
// @access  Private/Admin
const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate('category', 'name')
      .sort({ name: 1 });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sub-categories by category ID
// @route   GET /api/subcategories/by-category/:categoryId
// @access  Public
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ 
      category: req.params.categoryId,
      isActive: true 
    }).sort({ name: 1 });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sub-category
// @route   GET /api/subcategories/:id
// @access  Public
const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category', 'name');
    if (subCategory) {
      res.json(subCategory);
    } else {
      res.status(404).json({ message: 'Sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a sub-category
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    // Verify that the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Parent category not found' });
    }

    // Check if sub-category already exists within this category
    const subCategoryExists = await SubCategory.findOne({ 
      name: name.trim(),
      category: category 
    });
    if (subCategoryExists) {
      return res.status(400).json({ message: 'Sub-category already exists for this category' });
    }

    // Handle file upload
    let image = req.body.image || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const subCategory = new SubCategory({
      name: name.trim(),
      category,
      description,
      image
    });

    const createdSubCategory = await subCategory.save();
    await createdSubCategory.populate('category', 'name');
    res.status(201).json(createdSubCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a sub-category
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubCategory = async (req, res) => {
  try {
    const { name, category, description, isActive } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
      // If changing category, verify it exists
      if (category && category !== subCategory.category.toString()) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(400).json({ message: 'Parent category not found' });
        }
        subCategory.category = category;
      }

      // Check if name is being changed and if new name already exists for this category
      if (name && name.trim() !== subCategory.name) {
        const subCategoryExists = await SubCategory.findOne({ 
          name: name.trim(),
          category: category || subCategory.category,
          _id: { $ne: subCategory._id }
        });
        if (subCategoryExists) {
          return res.status(400).json({ message: 'Sub-category name already exists for this category' });
        }
        subCategory.name = name.trim();
      }

      subCategory.description = description || subCategory.description;
      
      // Handle file upload
      if (req.file) {
        subCategory.image = `/uploads/${req.file.filename}`;
      } else if (req.body.image !== undefined) {
        subCategory.image = req.body.image;
      }
      
      if (isActive !== undefined) subCategory.isActive = isActive;

      const updatedSubCategory = await subCategory.save();
      await updatedSubCategory.populate('category', 'name');
      res.json(updatedSubCategory);
    } else {
      res.status(404).json({ message: 'Sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a sub-category
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
      await subCategory.deleteOne();
      res.json({ message: 'Sub-category removed' });
    } else {
      res.status(404).json({ message: 'Sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubCategories,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
