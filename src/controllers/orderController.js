const { Order, User } = require('../models');


exports.listOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.json(orders);
};


exports.createOrder = async (req, res) => {
    try {
        const { user_id, totalPrice, status } = req.body;
        const order = await Order.create({ user_id, totalPrice, status });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: "Order introuvable" });
        }

        // Supprimer l'ordre (a voir si besoin de supprimer une association ensuite donc )
        await Order.destroy({ where: { id } });
        
        res.json({ message: "Order supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Erreur lors de la suppression de l'order : ", error);
    }
};