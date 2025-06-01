const { ServiceType } = require('../models');

exports.listServiceTypes = async (req, res) => {
    try {
        const serviceTypes = await ServiceType.findAll();
        res.json(serviceTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createServiceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const st = await ServiceType.create({ name, description });
    res.status(201).json(st);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateServiceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const type = await ServiceType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ error: "Type de service non trouvé." });
    type.name = name;
    type.description = description;
    await type.save();
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteServiceType = async (req, res) => {
  try {
    const type = await ServiceType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ error: "Type de service non trouvé." });
    await type.destroy();
    res.json({ message: "Type de service supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
