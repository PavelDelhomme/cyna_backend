const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');
const loadUserProfile = require('../middlewares/loadUserProfile');

router.post('/', authMiddleware(), loadUserProfile, addressController.addAddressToUser);
router.get('/me', authMiddleware(), loadUserProfile, addressController.getUserAddresses);

module.exports = router;
