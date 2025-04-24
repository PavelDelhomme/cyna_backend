const { UserProfile } = require("../models");

module.exports = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Utilisateur non authentifié' });

        const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
        if (!profile) return res.status(404).json({ error: "Profil utilisateur introuvable" });

        req.user.user_profile = profile;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors du chargement du profil utilisateur" });
    }
};