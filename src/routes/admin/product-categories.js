const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const cat     = require('../../controllers/productCategoryController');

router.use(auth(['admin','seller']));

router.get('/', cat.listProductCategories);
router.post('/:categoryId/promo-codes/:promoCodeId', cat.assignPromoToProductCategory);

module.exports = router;
