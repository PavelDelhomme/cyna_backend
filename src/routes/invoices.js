const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const inv     = require('../controllers/invoiceController');

router.use(auth(['admin']));

router
  .route('/')
  .get(inv.listInvoices)
  .post(inv.createInvoice);

router
  .route('/:id')
  .get(inv.getInvoiceById)
  .patch(inv.updateInvoice)
  .delete(inv.deleteInvoice);

module.exports = router;
