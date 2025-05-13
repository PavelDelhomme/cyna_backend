const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ajouter une adresse
router.post('/add-address', authMiddleware(['user', 'admin']), addressController.addAddressToUser);

// Voir ses adresses
router.get('/list-my-addresses', authMiddleware(['user', 'admin']), addressController.getUserAddresses);

module.exports = router;
