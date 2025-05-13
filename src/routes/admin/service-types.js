const express = require('express');
const router = express.Router();
const serviceTypeController = require('../../controllers/serviceTypeController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-service-types', authMiddleware(['admin']), serviceTypeController.listServiceTypes);

module.exports = router;
