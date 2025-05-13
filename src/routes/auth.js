const express = require('express');
const router = express.Router();
const { signup, login, refreshToken } = require('../controllers/authController');
const { User, Role } = require('../models');

router.post('/signup-user', signup);
router.post('/login-user', login);
router.post('/refresh-token', refreshToken);

module.exports = router;
