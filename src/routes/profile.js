const express = require("express");
const router = express.Router();
const profileController = require('controller/profileController');
const addressController = require('controllers/addressController');
const authMiddleware = require('middlewares/authMiddleware');

router.get('/get-my-profile', authMiddleware(['user', 'admin']), profileController.getMyProfile);
router.patch('/update-my-profile', authMiddleware(['user', 'admin']), profileController.updateMyProfile);
router.delete('/delete-my-profile', authMiddleware(['user', 'admin']), profileController.deleteMyProfile);

router.get('/get-my-addresses', authMiddleware(['user', 'admin']), addressController.getUserAddresses);
router.post('/add-address-to-my-profile', authMiddleware(['user', 'admin']), addressController.addAddressToUser);
router.patch('/update-my-address/:id', authMiddleware(['user', 'admin']), addressController.updateUserAddress);
router.delete('/delete-my-address/:id', authMiddleware(['user', 'admin']), addressController.deleteUserAddress);

module.exports = router;
