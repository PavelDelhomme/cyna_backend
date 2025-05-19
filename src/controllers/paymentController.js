const { 
    Payment
} = require('../models');

exports.listPayments = async (req, res) => {
    const payments = await Payment.findAll();
    res.json(payments);
};


exports.createPayment = async (req, res) => {
    try {
        const { amount, status, user_id } = req.body;
        const payment = await Payment.create({ amount, status, user_id });
        res.status(201).json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
