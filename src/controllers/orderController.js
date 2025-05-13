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