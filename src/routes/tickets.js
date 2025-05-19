const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const tic     = require('../controllers/ticketController');

router.get('/',  auth(['user','admin']), tic.listTickets);
router.post('/', auth(['user','admin']), tic.createTicket);

module.exports = router;
