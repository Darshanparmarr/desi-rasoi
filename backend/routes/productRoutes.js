const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getFeaturedProducts,
  getProductsByCategory,
} = require('../controllers/productController');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/featured').get(getFeaturedProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
