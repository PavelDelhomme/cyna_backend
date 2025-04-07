const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(['admin']), promoCodeController.createPromoCode);
router.post('/:promoCodeId/roles/:roleId', authMiddleware(['admin']), promoCodeController.associatePromoToRole);

module.exports = router;
