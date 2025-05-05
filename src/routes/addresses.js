const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const loadUserProfile = require('../middlewares/loadUserProfile');

// Ajouter une adresse
router.post('/', authMiddleware(), loadUserProfile, addressController.addAddressToUser);

// Voir ses adresses
router.get('/me', authMiddleware(['user', 'admin']), loadUserProfile, addressController.getUserAddresses);

// Modifier une adresse
router.patch('/:id', authMiddleware(), loadUserProfile, addressController.updateUserAddress);

// Supprimer une adresse
router.delete('/:id', authMiddleware(), loadUserProfile, addressController.deleteUserAddress);

module.exports = router;
