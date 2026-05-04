const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getCategories,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Public routes
router.get('/', getCategories);

// Specific named routes must come before /:id to avoid being matched as an id param
router.get('/admin/all', protect, admin, getAllCategories);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createCategory);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

// Parameterised public route — kept last so named routes match first
router.get('/:id', getCategoryById);

module.exports = router;
