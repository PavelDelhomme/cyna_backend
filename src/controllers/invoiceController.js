const { Invoice } = require('../models');


exports.listInvoices = async (req, res) => {
    const invoices = await Invoice.findAll();
    res.json(invoices);
};

exports.createInvoice = async (req, res) => {
    try {
      const { name, email, amount, phone, method, quantity, created_at, updated_at, user_id, payment_id} = req.body;

        if (!name || !user_id || !payment_id) {
            return res.status(400).json({ error: "Champs obligatoires manquants." });
        }

      const invoice = await Invoice.create({ name, email, amount, phone, method, quantity, created_at, updated_at, user_id, payment_id });
      res.status(201).json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


// Récupérer une facture par ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email' ] },
                { model: Payment, attributes: ['id', 'amount', 'status' ] }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ error: "Facture non trouvée" });
        }

        res.json(invoice);
    } catch (error) {
        console.error("[invoiceController.js] Erreur getInvoiceById", error);
        res.status(500).json({ error: error.message });
    }
};

// Modifier une facture par ID
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: "Facture non trouvée"});
        }
        
        await invoice.update(req.body);

        res.json({ message: "Facture mise à jour", invoice });
    } catch (error) {
        console.error("[invoiceController.js] Erreur updateInvoice", error);
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une facture par ID
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: "Facture non trouvée" });
        }

        await invoice.destroy();

        res.json({ message: "Facture supprimée" });
    } catch (error) {
        console.error("[invoiceController.js Erreur deleteInvoice", error);
        res.status(500).json({ error: error.message });
    }
}