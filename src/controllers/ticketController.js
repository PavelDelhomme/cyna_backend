const { 
    Ticket, User, TicketMessage
} = require('../models');

// Lister tous les tickets (admin)
exports.listTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: TicketMessage,
                    as: 'messages',
                    attributes: ['id', 'is_admin', 'created_at'],
                    separate: true,
                    order: [['created_at', 'DESC']]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(tickets);
    } catch (err) {
        console.error('Erreur listTickets:', err);
        res.status(500).json({ error: err.message });
    }
};

// Lister les tickets d'un utilisateur connecté
exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id; // Utiliser l'utilisateur connecté
        const tickets = await Ticket.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: TicketMessage,
                    as: 'messages',
                    attributes: ['id', 'is_admin', 'created_at'],
                    separate: true,
                    order: [['created_at', 'DESC']]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(tickets);
    } catch (err) {
        console.error('Erreur getUserTickets:', err);
        res.status(500).json({ error: err.message });
    }
};

// Créer un nouveau ticket
exports.createTicket = async (req, res) => {
    try {
        const { subject, description, type } = req.body;
        const user_id = req.user.id; // Utiliser l'utilisateur connecté
        
        // Validation des données
        if (!subject || !description) {
            return res.status(400).json({ 
                error: 'Sujet et description sont requis' 
            });
        }

        const ticket = await Ticket.create({ 
            subject, 
            description, 
            type: type || 'support_technique',
            user_id,
            status: 'nouveau'
        });

        // Récupérer le ticket créé avec les informations utilisateur
        const ticketWithUser = await Ticket.findByPk(ticket.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(201).json(ticketWithUser);
    } catch (err) {
        console.error('Erreur createTicket:', err);
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un ticket (status, assignation, etc.)
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assigned_to, admin_response, resolved_at, closed_at } = req.body;

        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }

        // Mise à jour des champs
        const updateData = {};
        if (status) updateData.status = status;
        if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
        if (admin_response !== undefined) updateData.admin_response = admin_response;
        if (resolved_at !== undefined) updateData.resolved_at = resolved_at;
        if (closed_at !== undefined) updateData.closed_at = closed_at;

        // Auto-remplir les dates selon le statut
        if (status === 'resolu' && !resolved_at) {
            updateData.resolved_at = new Date();
        }
        if (status === 'ferme' && !closed_at) {
            updateData.closed_at = new Date();
        }

        await ticket.update(updateData);

        // Récupérer le ticket mis à jour avec les associations
        const updatedTicket = await Ticket.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.json(updatedTicket);
    } catch (err) {
        console.error('Erreur updateTicket:', err);
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un ticket (admin seulement)
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }

        await ticket.destroy();
        res.json({ message: 'Ticket supprimé avec succès' });
    } catch (err) {
        console.error('Erreur deleteTicket:', err);
        res.status(500).json({ error: err.message });
    }
};

// Obtenir un ticket par ID
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }

        res.json(ticket);
    } catch (err) {
        console.error('Erreur getTicketById:', err);
        res.status(500).json({ error: err.message });
    }
};

// Statistiques des tickets (pour le dashboard admin)
exports.getTicketStats = async (req, res) => {
    try {
        const totalTickets = await Ticket.count();
        const openTickets = await Ticket.count({
            where: { status: ['nouveau', 'ouvert', 'en_cours'] }
        });
        const resolvedTickets = await Ticket.count({
            where: { status: 'resolu' }
        });
        const closedTickets = await Ticket.count({
            where: { status: 'ferme' }
        });

        // Répartition par type
        const ticketsByType = await Ticket.findAll({
            attributes: [
                'type',
                [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('id')), 'count']
            ],
            group: ['type']
        });

        res.json({
            total: totalTickets,
            open: openTickets,
            resolved: resolvedTickets,
            closed: closedTickets,
            byType: ticketsByType
        });
    } catch (err) {
        console.error('Erreur getTicketStats:', err);
        res.status(500).json({ error: err.message });
    }
};

