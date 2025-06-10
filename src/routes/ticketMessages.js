const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ticketMessageController = require('../controllers/ticketMessageController');

// Routes pour les messages de tickets
router.get('/ticket/:ticketId/messages', 
    auth(['user', 'admin']), 
    ticketMessageController.getTicketMessages
);

router.post('/ticket/:ticketId/messages', 
    auth(['user', 'admin']), 
    ticketMessageController.addTicketMessage
);

router.delete('/messages/:messageId', 
    auth(['admin']), 
    ticketMessageController.deleteTicketMessage
);

module.exports = router; 