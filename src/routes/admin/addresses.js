const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/addressController');
const authMiddleware = require('../../middlewares/authMiddleware');
const loadUserProfile = require('../../middlewares/loadUserProfile');

router.patch('/update-address/:id', authMiddleware(), loadUserProfile, addressController.updateUserAddress);
router.delete('/delete-address/:id', authMiddleware(), loadUserProfile, addressController.deleteUserAddress);

module.exports = router;
