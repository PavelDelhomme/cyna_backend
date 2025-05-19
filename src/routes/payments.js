const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const pay     = require('../controllers/paymentController');

router.get('/',  auth(['user','admin']), pay.listPayments);
router.post('/', auth(['user','admin']), pay.createPayment);

module.exports = router;
