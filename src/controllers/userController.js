const db = require('../models');
const {User, Role, UserProfile} = db;


exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'role'
      }]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


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
    const [role] = await Role.findOrCreate({ where: { name: 'user' } });
    const user = await User.create({ name, email, password, role_id: role.id });
    await UserProfile.create({ user_id: user.id });
    res.status(201).json(user);
  } catch (error) {
    console.error("[userController] Erreur création user", error);
    res.status(400).json({ error: error.message });
  }
};


// Attribuer un rôle à un utilisateur (admin uniquement)
exports.assignRoleToUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const role = await Role.findByPk(req.body.roleId);
    if (!role) return res.status(404).json({ error: "Rôle introuvable" });

    user.role_id = role.id;
    await user.save();

    res.json({ message: "Rôle attribué", user });
  } catch (error) {
    console.error("[userController] Erreur assignation rôle", error);
    res.status(500).json({ error: error.message });
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

exports.listUserTokens = async (req, res) => {
  const users = await User.findAll({
    include: [{
      model: Role,
      as: 'role' // 👈 obligatoire
    }]
  });

  const jwt = require("jsonwebtoken");
  const tokens = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role?.name || 'N/A',
    token: jwt.sign({ userId: u.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
  }));
  res.json(tokens);
};


exports.resetUsers = async (req, res) => {
  try {
    const adminUser = await User.findOne({ where: { email: 'admin@cyna.dev' } });
    if (!adminUser) return res.status(404).json({ error: "Admin introuvable." });

    await UserProfile.destroy({ where: { user_id: { [require('sequelize').Op.ne]: adminUser.id } } });
    await User.destroy({ where: { id: { [require('sequelize').Op.ne]: adminUser.id } } });

    res.json({ message: "Tous les utilisateurs (sauf admin) supprimés." });
  } catch (error) {
    console.error("[devController.js] Erreur lors du reset ", error);
    res.status(500).json({ error: "Erreur lors du reset" });
  }
};

