const express   = require('express');
const router    = express.Router();
const auth      = require('../middlewares/authMiddleware');
const prod      = require('../controllers/productController');

router.get('/', auth(['user', 'admin']), prod.listProducts);
router.post('/', auth(['admin', 'user']), prod.createProduct);

module.exports = router;