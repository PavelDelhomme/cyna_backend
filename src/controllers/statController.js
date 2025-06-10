const { Stat } = require('../models');
const { sequelize } = require('../models');

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
        const [results] = await sequelize.query(`
            SELECT
            DATE_FORMAT(o.creationdate, '%Y-%m') AS month,
            COUNT(DISTINCT oip.order_item_id) AS productSales,
            COUNT(DISTINCT ois.order_item_id) AS serviceSales
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN order_item_products oip ON oip.order_item_id = oi.id
            LEFT JOIN order_item_services ois ON ois.order_item_id = oi.id
            GROUP BY month
            ORDER BY month;
        `);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
