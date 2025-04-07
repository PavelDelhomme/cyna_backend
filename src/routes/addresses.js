const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(), addressController.addAddressToUser);
router.get('/me', authMiddleware(), addressController.getUserAddresses);

module.exports = router;
