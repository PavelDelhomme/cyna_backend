const express = require('express');
const router = express.Router();
const { User, UserProfile } = require('../models');

// Supprimer tous les utilisateurs sauf l'admin
router.delete('/reset-users', async (req, res) => {
  try {
    // Trouver l'admin
    const adminUser = await User.findOne({ where: { email: 'admin@cyna.dev' } });

    if (!adminUser) {
      return res.status(404).json({ error: "Admin introuvable. Créez-le avec /api/auth/dev-admin" });
    }

    // Supprimer tous les UserProfiles sauf celui de l'admin
    await UserProfile.destroy({
      where: {
        user_id: {
          [require('sequelize').Op.ne]: adminUser.id
        }
      }
    });

    // Supprimer tous les utilisateurs sauf l'admin
    await User.destroy({
      where: {
        id: {
          [require('sequelize').Op.ne]: adminUser.id
        }
      }
    });

    res.json({ message: "Tous les utilisateurs (sauf admin) ont été supprimés avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors du reset des utilisateurs" });
  }
});

module.exports = router;
