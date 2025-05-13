const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-products', authMiddleware(['admin']), productController.listProducts);
router.post('/create-product', authMiddleware(['admin']), productController.createProduct);

module.exports = router;
