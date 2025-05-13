const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/invoices', authMiddleware(['admin, user']), invoiceController.listInvoices);
router.post('/invoices/user/create/:userId', authMiddleware(['admin, user']), invoiceController.createInvoice);
router.post('/invoices/getById/:invoiceId', authMiddleware(['admin, user']), invoiceController.getInvoiceById);
router.patch('/invoices/user/update/:userId', authMiddleware(['admin, user']), invoiceController.updateInvoice);
router.delete('/invoices/user/delete/:userId', authMiddleware(['admin, user']), invoiceController.deleteInvoice);


module.exports = router;