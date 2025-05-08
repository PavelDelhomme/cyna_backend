const db = require('../models');
const {User, Role, UserProfile} = db;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'role'
      }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: ['role']
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.role.name !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Seul l'utilisateur peut modifier son mot de passe" });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    if (!user.validPassword(currentPassword)) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Seul Admin OU Le propriétéiare peuvent supprimer
    if (req.user.role.name !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    
    await user.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: ['role']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.params.id },
      include: ['addresses']
    });
    if (!userProfile) return res.status(404).json({ error: 'Profil introuvable' });
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.role.name !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: "Accès interdit" });
    }

    const profile = await UserProfile.findOne({ where: { user_id: userId } });
    if (!profile) return res.status(404).json({ error: "Profil introuvable" });

    await profile.destroy();
    res.json({ message: "Profil supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
