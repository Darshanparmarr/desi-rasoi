const express = require('express');
const router = express.Router();
const { protect, admin, adminOrEmployee, optional } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  markOrderDelivered,
  getMyOrders,
  getOrders,
  generateInvoicePDF,
  lookupGuestOrder,
} = require('../controllers/orderController');

// Public routes (for guest checkout)
router.route('/').post(optional, createOrder);
router.route('/guest-lookup').post(lookupGuestOrder);

// Protected routes - Admin or Employee can access orders
router.route('/').get(protect, adminOrEmployee, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(optional, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/invoice').get(protect, generateInvoicePDF);

// Employee/Admin delivery endpoint with photo upload
router.route('/:id/deliver').put(protect, adminOrEmployee, upload.single('deliveryPhoto'), markOrderDelivered);

module.exports = router;
