const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const pay     = require('../../controllers/paymentController');

router.use(auth(['admin']));

router
  .route('/')
  .get(pay.listPayments)
  .post(pay.createPayment);

module.exports = router;
