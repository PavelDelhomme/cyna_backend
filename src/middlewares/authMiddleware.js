const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (roles = []) => {
    return async (req, res, next) => {
        //const token = req.headers.authorization?.split(' ')[1];
        const authHeader = req.headers.authorization;

        if (!authHeader?.startWith('Bearer ')) {
            return res.status(401).json({ error: "Token non fourni" });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await req.db.User.findByPk(decoded.userId, {
                include: [{
                    model: Role,
                    attributes: ['name']
                }]
            });
            
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
            if (roles.length && !roles.includes(user.Role.name)) {
                return res.status(403).json({ error: "Accès non autorisé" });
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ error: "Token invalide ou expiré" });
        }
    };
};