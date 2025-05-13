const { Payment } = require('../models');

exports.listPayments = async (req, res) => {
    const payments = await Payment.findAll();
    res.json(payments);
};


exports.createPayment = async (req, res) => {
    try {
        const { amount, status} = req.body;


        const payment = await Payment.create({ amount, status});
        res.status(201).json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ error: "Payment non trouvé"});
        }
        
        await payment.update(req.body);

        res.json({ message: "Payment mis à jour", payment });
    } catch (error) {
        console.error("[paymentController.js] Erreur updatePayment", error);
        res.status(500).json({ error: error.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);

        if (!payment) {
            return res.status(404).json({ error: "Payment inexistant" });
        }

  
        await payment.destroy();

        res.json({ message: "Payment supprimé" });
    } catch (error) {
        console.error("[paymentController.js Erreur deletePayment", error);
        res.status(500).json({ error: error.message });
    }
}