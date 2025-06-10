const { 
    TicketMessage, Ticket, User
} = require('../models');

// Récupérer tous les messages d'un ticket
exports.getTicketMessages = async (req, res) => {
    try {
        const { ticketId } = req.params;
        
        // Vérifier que le ticket existe et que l'utilisateur y a accès
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }

        // Vérifier les permissions : propriétaire du ticket ou admin
        const userRole = req.user.role;
        if (userRole !== 'admin' && ticket.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        const messages = await TicketMessage.findAll({
            where: { ticket_id: ticketId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'ASC']]
        });

        res.json(messages);
    } catch (err) {
        console.error('Erreur getTicketMessages:', err);
        res.status(500).json({ error: err.message });
    }
};

// Ajouter un message à un ticket
exports.addTicketMessage = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role; // Le rôle est déjà une chaîne dans authMiddleware

        // Validation
        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Le message est requis' });
        }

        // Vérifier que le ticket existe
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket non trouvé' });
        }

        // Vérifier les permissions : propriétaire du ticket ou admin
        if (userRole !== 'admin' && ticket.user_id !== userId) {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        // Vérifier que le ticket n'est pas fermé (sauf pour les admins)
        if (ticket.status === 'ferme' && userRole !== 'admin') {
            return res.status(400).json({ error: 'Impossible d\'ajouter un message à un ticket fermé' });
        }

        // Créer le message
        const ticketMessage = await TicketMessage.create({
            ticket_id: ticketId,
            user_id: userId,
            message: message.trim(),
            is_admin: userRole === 'admin'
        });

        // Mettre à jour le statut du ticket si nécessaire
        let newStatus = ticket.status;
        if (userRole === 'admin' && ticket.status === 'nouveau') {
            newStatus = 'en_cours';
        } else if (userRole !== 'admin' && ticket.status === 'resolu') {
            newStatus = 'ouvert'; // Réouvrir si l'utilisateur répond après résolution
        }

        if (newStatus !== ticket.status) {
            await ticket.update({ status: newStatus });
        }

        // Récupérer le message créé avec les informations utilisateur
        const messageWithUser = await TicketMessage.findByPk(ticketMessage.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(201).json(messageWithUser);
    } catch (err) {
        console.error('Erreur addTicketMessage:', err);
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un message (admin seulement)
exports.deleteTicketMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userRole = req.user.role; // Le rôle est déjà une chaîne dans authMiddleware

        if (userRole !== 'admin') {
            return res.status(403).json({ error: 'Seuls les administrateurs peuvent supprimer des messages' });
        }

        const message = await TicketMessage.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        await message.destroy();
        res.json({ message: 'Message supprimé avec succès' });
    } catch (err) {
        console.error('Erreur deleteTicketMessage:', err);
        res.status(500).json({ error: err.message });
    }
}; 