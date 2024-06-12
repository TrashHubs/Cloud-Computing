const express = require("express");
const router = express.Router();

const { register, login, profile, update, changePassword, resetPassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', verifyToken, profile);
router.put('/update/:id', verifyToken, update);
router.put('/change-password/:id', verifyToken, changePassword);
router.post('/reset-password', resetPassword);

module.exports = router;
