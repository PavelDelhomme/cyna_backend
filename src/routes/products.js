const express   = require('express');
const router    = express.Router();
const auth      = require('../middlewares/authMiddleware');
const prod      = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route publique pour lister les produits
router.get('/', prod.listProducts);

// GET /products/:id
router.get('/product/:id', prod.getProductByIdasync);


// Routes protégées pour l'administration
router.post('/', auth(['admin']), upload.single('image'), prod.createProduct);
router.put('/:id', auth(['admin']), upload.single('image'), prod.updateProduct);
router.delete('/:id', auth(['admin']), prod.deleteProduct);
router.get('/:id/dependencies', auth(['admin']), prod.checkProductDependencies);

module.exports = router;