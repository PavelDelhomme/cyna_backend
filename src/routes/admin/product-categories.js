const express = require('express');
const router = express.Router();
const productCategoryController = require('../../controllers/productCategoryController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-product-categories', authMiddleware(['admin']), productCategoryController.listProductCategories);
router.post('/apply-promo-to-category/:promoId/:categoryId', authMiddleware(['admin']), productCategoryController.assignPromoToProductCategory);

module.exports = router;
