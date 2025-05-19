const { Stat } = require('../models');



exports.createStat = async (req, res) => {
    try {
        const { key, value } = req.body;
        const stat = await Stat.create({ key, value });
        res.status(201).json(stat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listStats = async (req, res) => {
    try {
        const stats = await Stat.findAll();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
