const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const loadUserProfile = require('../middlewares/loadUserProfile');

// Ajouter une adresse
router.post('/', authMiddleware(), loadUserProfile, addressController.addAddressToUser);

// Voir ses adresses
router.get('/me', authMiddleware(['user', 'admin']), loadUserProfile, addressController.getUserAddresses);

module.exports = router;
