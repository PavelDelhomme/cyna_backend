const { UserProfile, User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone']
    });
    
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Séparer le nom complet en prénom et nom
    const nameParts = user.name.split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    // Créer un nouvel objet avec les champs séparés
    const userWithSeparatedName = {
      ...user.toJSON(),
      firstname,
      lastname
    };

    res.json(userWithSeparatedName);
  } catch (error) {
    console.error("[profileController] Erreur récupération de mon profil", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // On ne met à jour que les champs autorisés
    const { firstname, lastname, email, phone } = req.body;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json({ message: "Profil mis à jour", user });
  } catch (error) {
    console.error("[profileController] Erreur mise à jour profil", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ where: { user_id: req.user.id } });
    if (!userProfile) return res.status(404).json({ error: 'Profil introuvable' });

    await userProfile.destroy();

    res.json({ message: "Profil supprimé" });
  } catch (error) {
    console.error("[profileController] Erreur suppression profil", error);
    res.status(500).json({ error: error.message });
  }
};

exports.listProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        'addresses'
      ]
    });
    res.json(profiles);
  } catch (error) {
    console.error("[userProfileController] Erreur liste profiles", error);
    res.status(500).json({ error: error.message });
  }
};


exports.fixProfiles = async (req, res) => {
  try {
    const users = await User.findAll();
    const created = [];
    for (const user of users) {
      const [profile, isNew] = await UserProfile.findOrCreate({ where: { user_id: user.id } });
      if (isNew) created.push(user.email);
    }
    res.json({ message: "Profils vérifiés/Créés", newlyCreated: created });
  } catch (error) {
    console.error("[userProfileController] Erreur fix profiles", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ where: { email: 'admin@cyna.dev' } });
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' });

    const [profile, created] = await UserProfile.findOrCreate({ where: { user_id: admin.id } });
    res.json({ message: created ? "Profil admin créé" : "Profil déjà existant", profile });
  } catch (err) {
    console.error("[devController.js] Erreur lors de la tentative de création du profil pour l'administrateur", error);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await user.validPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le nouveau mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error("[profileController] Erreur mise à jour mot de passe", error);
    res.status(500).json({ error: error.message });
  }
};