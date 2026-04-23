const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

router.use(protect); // All wishlist routes require authentication

router.route('/').get(getWishlist).delete(clearWishlist);
router.route('/add').post(addToWishlist);
router.route('/check/:productId').get(checkWishlist);
router.route('/:itemId').delete(removeFromWishlist);

module.exports = router;
