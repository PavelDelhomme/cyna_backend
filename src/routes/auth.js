const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

// Inscription & connexion (pas de JWT requis)
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

// Renouvellement de token
router.post('/refresh', authCtrl.refreshToken);

module.exports = router;