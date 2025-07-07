const { Role } = require('../models');



exports.listRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error("[roleController] Erreur lors de la récupération des rôles", error);
    res.status(500).json({ error: error.message });
  }
};




exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    console.error("[roleController] Erreur lors de la création du rôle", error);
    res.status(500).json({ error: error.message });
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


exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: "Rôle non trouvé" });
    await role.destroy();
    res.json({ message: "Rôle supprimé" });
  } catch (error) {
    console.error("[roleController] Erreur lors de la suppression du rôle", error);
    res.status(500).json({ error: error.message });
  }
};