const express = require('express');
const router = express.Router();
const statController = require('../../controllers/statController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-stats', authMiddleware(['admin']), statController.listStats);

module.exports = router;
