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
      const user = await User.findByPk(decoded.userId, { include: [Role] });

      if (!user) return res.status(401).json({ error: "Utilisateur introuvable" });

      const userRole = user.Role?.name;
      req.user = { id: user.id, role: userRole };

      console.log(`[AUTH] Utilisateur #${user.id}, rôle : ${userRole}`);

      if (roles.length > 0 && !roles.includes(userRole)) {
        return res.status(403).json({ error: "Accès interdit" });
      }

      next();
    } catch (err) {
      console.error("[AUTH ERROR]", err.message);
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  };
};
