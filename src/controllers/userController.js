const db = require('../models');
const User = db.User;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: ['role'] });
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
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const { name, email, password } = req.body;
    await user.update({ name, email, password });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
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
    const profile = await UserProfile.findOne({ where: { user_id: req.params.id } });
    if (!profile) return res.status(404).json({ error: "Profil introuvable" });
    await profile.destroy();
    res.json({ message: "Profil supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
