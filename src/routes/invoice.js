const express = require('express');
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/', authMiddleware(['admin']), invoiceController.listInvoices);
router.get('/:id', authMiddleware(['admin']), invoiceController.getInvoiceById);
router.post('/', authMiddleware(['admin']), invoiceController.createInvoice);
router.patch('/:id', authMiddleware(['admin']), invoiceController.updateInvoice);
router.delete('/:id', authMiddleware(['admin']), invoiceController.deleteInvoice);

module.exports = router;