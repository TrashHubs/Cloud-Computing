const express = require("express");
const router = express.Router();

const { register, login, profile, update, changePassword, sendResetPassword, resetPassword, logout, refreshToken } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/profile/:id', verifyToken, profile);
router.put('/update/:id', verifyToken, update);

router.put('/change-password/:id', verifyToken, changePassword);
router.post('/send-reset-password', sendResetPassword);
router.put('/reset-password', resetPassword);

router.get('/logout/:id', verifyToken, logout);

router.get('/refresh-token/:id', refreshToken);

module.exports = router;
