const {
    Payment
} = require('../models');

exports.listPayments = async (req, res) => {
    const userId = req.user.id;
    const payments = await Payment.findAll({ where: { user_id: userId } });
    res.json(payments);
};


exports.createPayment = async (req, res) => {
    console.log('createPayment called', req.body);
    try {
        const { amount, status, user_id, method, type, last4, expiry, isDefault, order_id } = req.body;
        const payment = await Payment.create({ amount, status, user_id, method, type, last4, expiry, isDefault, order_id });
        res.status(201).json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Met à jour un paiement existant
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, status, method, type, last4, expiry, isDefault, user_id, order_id } = req.body;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }

        await payment.update({ amount, status, method, type, last4, expiry, isDefault, user_id, order_id });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprime un paiement existant
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }

        await payment.destroy();
        res.json({ message: 'Paiement supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
