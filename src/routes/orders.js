const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const ord     = require('../controllers/orderController');

router.get('/',           auth(['user','admin']), ord.listOrders);
router.get('/user/:userId', auth(['user','admin']), ord.getUserOrders);
router.post('/',          auth(['user','admin']), ord.createOrder);
router.delete('/:id',     auth(['admin']),        ord.deleteOrder);

module.exports = router;
