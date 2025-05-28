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
    const { name, description } = req.body;
    const st = await ServiceType.create({ name, description });
    res.status(201).json(st);
  };
  