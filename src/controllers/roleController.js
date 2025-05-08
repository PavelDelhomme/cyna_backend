const { Role } = require('../models');

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.length > 255) {
      return res.status(400).json({ error: "Nom de rôle invalide." });
    }

    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};


exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
