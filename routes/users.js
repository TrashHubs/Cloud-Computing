const express = require("express");
const router = express.Router();

const { register, login, profile, update, changePassword } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', verifyToken, profile);
router.put('/update/:id', verifyToken, update);
router.put('/change-password/:id', verifyToken, changePassword);

module.exports = router;
