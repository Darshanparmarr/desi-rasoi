const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

router.use(protect); // All cart routes require authentication

router.route('/').get(getCart).delete(clearCart);
router.route('/add').post(addToCart);
router.route('/:itemId').put(updateCartItem).delete(removeFromCart);

module.exports = router;
