const express = require('express');
const router = express.Router();

const promoCodeController = require('../controllers/promoCodeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-promo-code', authMiddleware(['admin']), promoCodeController.createPromoCode);
router.get('/list-promo-codes', authMiddleware(['admin']), promoCodeController.getAllPromoCodes);
router.post('/assign-promo-code-role/:promoCodeId/roles/:roleId', authMiddleware(['admin']), promoCodeController.associatePromoToRole);

module.exports = router;
