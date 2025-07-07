const express   = require('express');
const router    = express.Router();
const auth      = require('../middlewares/authMiddleware');
const cat       = require('../controllers/productCategoryController');

// Route publique pour lister les catégories
router.get('/', cat.listProductCategories);

// Routes protégées pour l'administration
router.post('/', auth(['admin']), cat.createProductCategory);
router.post('/:id/promo-codes/:promoCodeId', auth(['admin']), cat.assignPromoToProductCategory);
router.put('/:id', auth(['admin']), cat.updateProductCategory);
router.delete('/:id', auth(['admin']), cat.deleteProductCategory);
router.get('/:id/dependencies', auth(['admin']), cat.checkProductCategoryDependencies);

module.exports = router;