const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const ord     = require('../../controllers/orderController');

router.use(auth(['admin']));

router
  .route('/')
  .get(ord.listOrders)
  .post(ord.createOrder);

router.delete('/:id', ord.deleteOrder);

module.exports = router;
