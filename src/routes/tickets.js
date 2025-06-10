const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const tic     = require('../controllers/ticketController');

// Routes publiques (avec authentification utilisateur)
router.get('/my-tickets',          auth(['user','admin']), tic.getUserTickets);
router.get('/stats',               auth(['admin']),        tic.getTicketStats);
router.get('/:id',                 auth(['user','admin']), tic.getTicketById);
router.post('/',                   auth(['user','admin']), tic.createTicket);

// Routes admin
router.get('/',                    auth(['admin']),        tic.listTickets);

// Routes d'administration
router.put('/:id',                 auth(['admin']),        tic.updateTicket);
router.delete('/:id',              auth(['admin']),        tic.deleteTicket);

module.exports = router;
