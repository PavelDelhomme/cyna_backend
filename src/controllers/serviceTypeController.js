const { ServiceType } = require('../models');

exports.listServiceTypes = async (req, res) => {
    try {
        const serviceTypes = await ServiceType.findAll();
        res.json(serviceTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
