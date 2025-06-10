const { 
    Ticket, User, Role
} = require('../models');

// Créer un ticket à partir d'un message de contact
exports.createContactTicket = async (req, res) => {
    try {
        const { subject, name, email, message } = req.body;
        
        // Validation des données
        if (!subject || !name || !email || !message) {
            return res.status(400).json({ 
                error: 'Tous les champs sont requis' 
            });
        }

        // Vérifier si l'utilisateur existe déjà par email
        let user = await User.findOne({ 
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        // Si l'utilisateur n'existe pas, créer un compte temporaire
        if (!user) {
            // Récupérer le rôle 'user'
            const userRole = await Role.findOne({ where: { name: 'user' } });
            if (!userRole) {
                return res.status(500).json({ error: 'Rôle utilisateur introuvable' });
            }

            user = await User.create({
                name: name,
                email: email,
                password: 'temp_password_' + Date.now(), // Mot de passe temporaire
                phone: null,
                role_id: userRole.id
            });
        }

        // Mapper le sujet vers un type de ticket approprié
        const subjectTypeMapping = {
            'commande': 'question_produit',
            'reclamation': 'support_technique',
            'autre': 'autre'
        };

        const ticketType = subjectTypeMapping[subject] || 'autre';

        // Créer le ticket
        const ticket = await Ticket.create({
            subject: `Contact: ${subject}`,
            description: `Message de ${name} (${email}):\n\n${message}`,
            type: ticketType,
            user_id: user.id,
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

        res.status(201).json({
            message: 'Message envoyé avec succès',
            ticket: ticketWithUser,
            isNewUser: !user.createdAt || user.createdAt.getTime() === user.updatedAt.getTime()
        });

    } catch (err) {
        console.error('Erreur createContactTicket:', err);
        res.status(500).json({ error: err.message });
    }
};

// Récupérer tous les tickets de contact (pour les admins)
exports.getContactTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            where: {
                subject: {
                    [require('sequelize').Op.like]: 'Contact:%'
                }
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(tickets);
    } catch (err) {
        console.error('Erreur getContactTickets:', err);
        res.status(500).json({ error: err.message });
    }
}; 