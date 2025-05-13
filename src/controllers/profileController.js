const { UserProfile, User } = require('../models');

exports.getMyProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: ['addresses']
    });
    if (!userProfile) return res.status(404).json({ error: 'Profil utilisateur introuvable' });
    res.json(userProfile);
  } catch (error) {
    console.error("[profileController] Erreur récupération de mon profil", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ where: { user_id: req.user.id } });
    if (!userProfile) return res.status(404).json({ error: 'Profil introuvable' });

    // Exemple : accepte des champs libres, à sécuriser selon ton besoin
    await userProfile.update(req.body);

    res.json({ message: "Profil mis à jour", userProfile });
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
    const profiles = await UserProfile.findAll();
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