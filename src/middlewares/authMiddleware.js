const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = (roles = []) => {
  // Accepte un rôle ou un tableau de rôles
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.userId, {
        include: [{ model: Role, as: 'role', attributes: ['name'] }]
      });

      if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

      // Vérifie le rôle si précisé
      if (roles.length > 0 && !roles.includes(user.role.name)) {
        return res.status(403).json({ error: "Accès refusé : rôle insuffisant" });
      }

      req.user = user;
      next();

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  };
};
