const { Service } = require('../models');

exports.listServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        console.log('Payload reçu pour création service :', req.body);

        const {
            name, description, price, status, subscription,
            subscriptionType, userCount, promotion, service_type_id
        } = req.body;

        if (!name || !price || !service_type_id) {
            return res.status(400).json({ error: "Champs obligatoires manquants." });
        }

        const service = await Service.create({
            name,
            description,
            price: parseFloat(price), // conversion ici
            status,
            subscription,
            subscriptionType,
            userCount: userCount === '' ? null : parseInt(userCount, 10), // conversion ici
            promotion,
            service_type_id: parseInt(service_type_id, 10) // conversion ici
        });

        res.status(201).json(service);
    } catch (err) {
        console.error('Erreur création service :', err);
        res.status(500).json({ error: err.message });
    }
};



exports.assignPromoToService = async (req, res) => {
    const { promoId, serviceId } = req.params;
    try {
        const promo = await PromoCode.findByPk(promoId);
        const service = await Service.findByPk(serviceId);
        if (!promo || !service) return res.status(404).json({ error: "Promo ou service non trouvé." });

        await service.update({ promo_code_id: promo.id });
        res.json({ message: "Code promo appliqué au service." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { name, description, price, status, subscription, subscriptionType, userCount, promotion, service_type_id } = req.body;
        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ error: "Service non trouvé." });
        service.name = name;
        service.description = description;
        service.price = price;
        service.status = status;
        service.subscription = subscription;
        service.subscriptionType = subscriptionType;
        service.userCount = userCount;
        service.promotion = promotion;
        service.service_type_id = service_type_id;
        await service.save();
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ error: "Service non trouvé." });
        await service.destroy();
        res.json({ message: "Service supprimé." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
