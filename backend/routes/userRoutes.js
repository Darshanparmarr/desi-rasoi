const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserRole,
  forgotPassword,
  resetPasswordWithOtp,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
