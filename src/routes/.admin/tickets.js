const express   = require('express');
const router    = express.Router();
const auth      = require("../../middlewares/authMiddleware");
const tic       = require("../../controllers/ticketController");

router.use(auth(['admin']))

router
    .route('/')
    .get(tic.listTickets)
    .post(tic.createTicket);

module.exports = router;