const express   = require('express');
const router    = express.Router();
const auth      = require('../middlewares/authMiddleware');
const prod      = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', auth(['user', 'admin']), prod.listProducts);
router.post('/', upload.single('image'), auth(['admin', 'user']), prod.createProduct);
router.put('/:id', upload.single('image'), auth(['admin']), prod.updateProduct);
router.delete('/:id', auth(['admin']), prod.deleteProduct);
router.get('/:id/dependencies', auth(['admin']), prod.checkProductDependencies);

module.exports = router;