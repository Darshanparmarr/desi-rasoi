const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getSubCategories,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require('../controllers/subCategoryController');

// Public routes
router.get('/', getSubCategories);
router.get('/by-category/:categoryId', getSubCategoriesByCategory);

// Specific named routes must come before /:id to avoid being matched as an id param
router.get('/admin/all', protect, admin, getAllSubCategories);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createSubCategory);
router.put('/:id', protect, admin, upload.single('image'), updateSubCategory);
router.delete('/:id', protect, admin, deleteSubCategory);

// Parameterised public route — kept last so named routes match first
router.get('/:id', getSubCategoryById);

module.exports = router;
