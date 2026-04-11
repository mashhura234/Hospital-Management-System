const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

//POST / api/ auth/ register
router.post('/register', register);

//POST / api/ auth/ login
router.post('/login', login);

//GET / api/ auth/ me - Get current user (requires token)
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;