const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/addressController');
const authMiddleware = require('../../middlewares/authMiddleware');
const loadUserProfile = require('../../middlewares/loadUserProfile');
// Modifier une adresse
router.patch('/:id', authMiddleware(), loadUserProfile, addressController.updateUserAddress);

// Supprimer une adresse
router.delete('/:id', authMiddleware(), loadUserProfile, addressController.deleteUserAddress);

module.exports = router;
