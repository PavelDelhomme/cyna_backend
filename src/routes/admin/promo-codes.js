const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const promo   = require('../../controllers/promoCodeController');

router.use(auth(['admin','seller']));

router
  .route('/')
  .get(promo.getAllPromoCodes)
  .post(promo.createPromoCode);

router.post('/:promoCodeId/roles/:roleId', promo.associatePromoToRole);

module.exports = router;
