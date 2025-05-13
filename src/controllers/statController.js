const { Stat } = require('../models');

exports.listStats = async (req, res) => {
    const stats = await Stat.findAll();
    res.json(stats);
};

exports.createStat = async (req, res) => {
    try {
        const { created_at, updated_at, user_profile_id } = req.body;

        if (!user_profile_id) {
            return res.status(404).json({ error: "User Profile Missing"});
        }

        
        const stat = await Stat.create({ created_at, updated_at, user_profile_id });
        res.status(201).json(stat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStat = async (req, res) => {
    try {
        const stat = await Stat.findByPk(req.params.id);
        const { created_at, updated_at, user_profile_id } = req.body;


        if (!stat) {
            return res.status(404).json({ error: "Stat inexistante"});
        }
        
        await stat.update({updated_at});

        res.json({ message: "Stat mise à jour", stat });
    } catch (error) {
        console.error("[statController.js] Erreur updateStat", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteStat = async (req, res) => {
    try {
        const stat = await Stat.findByPk(req.params.id);
        const { created_at, updated_at, user_profile_id } = req.body;

        if (!stat) {
            return res.status(404).json({ error: "Stat inexistante" });
        }

  
        await stat.destroy();

        res.json({ message: "Stat supprimée" });
    } catch (error) {
        console.error("[statController.js Erreur deleteStat", error);
        res.status(500).json({ error: error.message });
    }
}