const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const prod    = require('../../controllers/productController');

router.use(auth(['admin']));

router
  .route('/')
  .get(prod.listProducts)
  .post(prod.createProduct);

module.exports = router;
