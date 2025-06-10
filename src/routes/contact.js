const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const contactController = require('../controllers/contactController');

// Route publique pour créer un ticket via le formulaire de contact
router.post('/contact', contactController.createContactTicket);

// Route admin pour récupérer tous les tickets de contact
router.get('/contact/tickets', auth(['admin']), contactController.getContactTickets);

module.exports = router; 