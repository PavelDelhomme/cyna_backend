const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

module.exports = (roles = []) => {
  // Accepte un rôle ou un tableau de rôles
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn("[AUTH] Token manquant ou mal formé.");
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, { include: [{ model: Role, as: 'role' }] });

      if (!user) {
        console.warn("[AUTH] Utilisateur introuvable avec l'ID:", decoded.userId);
        return res.status(401).json({ error: "Utilisateur introuvable" });
      }

      req.user = { id: user.id, role: user.role?.name || 'inconnu', isAdmin: user.role?.name === 'admin', isUser: user.role?.name === 'user' };
      req.user.createdAt = user.createdAt;
      req.user.updatedAt = user.updatedAt;
      console.log(`[AUTH] Utilisateur: ${user.email} | Rôle: ${req.user.role} | Créé le: ${req.user.createdAt} | Mis à jour le: ${req.user.updatedAt}`);

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        console.warn(`[AUTH] Accès interdit - Rôle requis: ${roles.join(', ')} | Rôle actuel: ${req.user.role}`);
        return res.status(403).json({ error: "Accès interdit" });
      }

      next();
    } catch (err) {
      console.error("[AUTH ERROR] Vérification token échouée:", err.message);
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  };
};
