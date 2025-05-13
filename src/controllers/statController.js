const { Stat } = require('../models');

exports.listStats = async (req, res) => {
    try {
        const stats = await Stat.findAll();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
