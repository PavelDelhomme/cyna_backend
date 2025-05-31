const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Role, UserProfile } = require('../../models');

// Génération de token admin de dev
router.get('/generate-admin-token', async (req, res) => {
    try {
        const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
        const [user] = await User.findOrCreate({
            where: { email: 'admin@cyna.dev' },
            defaults: { name: 'Admin Dev', password: "azerty123", role_id: adminRole.id }
        });

        if (user.role_id !== adminRole.id) {
            user.role_id = adminRole.id;
            await user.save();
            await user.reload({ include: [{ model: Role, as: 'role' }] });
        }

        // Crée ou récupère le profil, et on garde l’instance dans `profile`
        const [profile, created] = await UserProfile.findOrCreate({
            where: { user_id: user.id }
        });

        const token = jwt.sign({ userId: user.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '365d' });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });

        res.json({ 
            token, 
            refreshToken,
            userId: user.id,
            profile: {
                id: profile.id,
                user_id: profile.user_id,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur de création admin" });
    }
});

module.exports = router;