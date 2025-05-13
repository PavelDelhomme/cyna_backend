const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-role', authMiddleware(['admin']), roleController.createRole);
router.get('/list-roles', authMiddleware(), roleController.getAllRoles);

module.exports = router;
