const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(['admin']), roleController.createRole);
router.get('/', authMiddleware(), roleController.getAllRoles);

module.exports = router;
