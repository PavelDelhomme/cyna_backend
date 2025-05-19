const { 
    Ticket
} = require('../models');


exports.listTickets = async (req, res) => {
    const tickets = await Ticket.findAll();
    res.json(tickets);
};


exports.createTicket = async (req, res) => {
    try {
        const { subject, description, user_id } = req.body;
        const ticket = await Ticket.create({ subject, description, user_id });
        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

