const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const invoiceController = require('../../controllers/invoiceController');

router.get('/', auth(['admin']), invoiceController.listInvoices);
router.get('/:id', auth(['admin']), invoiceController.getInvoiceById);
router.post('/', auth(['admin']), invoiceController.createInvoice);
router.patch('/:id', auth(['admin']), invoiceController.updateInvoice);
router.delete('/:id', auth(['admin']), invoiceController.deleteInvoice);

module.exports = router;