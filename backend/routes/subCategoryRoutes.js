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
router.get('/:id', getSubCategoryById);

// Admin routes
router.get('/admin/all', protect, admin, getAllSubCategories);
router.post('/', protect, admin, upload.single('image'), createSubCategory);
router.put('/:id', protect, admin, upload.single('image'), updateSubCategory);
router.delete('/:id', protect, admin, deleteSubCategory);

module.exports = router;
