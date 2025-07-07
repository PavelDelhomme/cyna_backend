const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(auth(['user', 'admin']));

// Routes pour les adresses
router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
