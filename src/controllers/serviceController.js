const { Service, PromoCode } = require('../models');

exports.listServices = async (req, res) => {
    try {
        const services = await Service.findAll({
          include: [{
            model: Service.sequelize.models.PromoCode,
            as: 'promoCode',
            required: false
          }],
          attributes: [
            'id',
            'name',
            'description',
            'status',
            'price',
            'subscription',
            'subscriptionType',
            'userCount',
            'promotion',
            'service_type_id',
            'promo_code_id',
            'createdAt',
            'updatedAt'
          ]
        });
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
            subscriptionType, userCount, promotion, service_type_id,
            promo_code_id
        } = req.body;

        if (name === undefined || name === null ||
            price === undefined || price === null ||
            service_type_id === undefined || service_type_id === null) {
            return res.status(400).json({ error: "Champs obligatoires manquants." });
        }

        const service = await Service.create({
            name,
            description,
            price: parseFloat(price),
            status,
            subscription,
            subscriptionType,
            userCount: userCount === '' ? null : parseInt(userCount, 10),
            promotion,
            service_type_id: parseInt(service_type_id, 10),
            promo_code_id: promo_code_id ? parseInt(promo_code_id, 10) : null
        });

        const serviceWithPromo = await Service.findByPk(service.id, {
            include: [{
                model: Service.sequelize.models.PromoCode,
                as: 'promoCode',
                required: false
            }]
        });

        res.status(201).json(serviceWithPromo);
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
        console.log('Payload reçu pour mise à jour service :', req.body);
        
        const {
            name, description, price, status, subscription,
            subscriptionType, userCount, promotion, service_type_id,
            promo_code_id
        } = req.body;

        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ error: "Service non trouvé." });

        // Préparer les données de mise à jour
        const updateData = {
            name: name,
            description: description,
            price: price ? parseFloat(price) : service.price,
            status: status,
            subscription: subscription,
            subscriptionType: subscriptionType,
            userCount: userCount === '' ? null : parseInt(userCount, 10),
            promotion: promotion,
            service_type_id: service_type_id ? parseInt(service_type_id, 10) : service.service_type_id
        };

        // Gérer le promo_code_id séparément
        if (promo_code_id === '') {
            updateData.promo_code_id = null;
        } else if (promo_code_id) {
            const promoCode = await PromoCode.findByPk(promo_code_id);
            if (!promoCode) {
                return res.status(400).json({ error: "Code promo non trouvé." });
            }
            updateData.promo_code_id = parseInt(promo_code_id, 10);
        }

        // Mise à jour du service
        await service.update(updateData);

        // Récupérer le service mis à jour avec les informations du code promo
        const updatedService = await Service.findByPk(service.id, {
            include: [{
                model: Service.sequelize.models.PromoCode,
                as: 'promoCode',
                required: false
            }]
        });
        
        res.json(updatedService);
    } catch (err) {
        console.error('Erreur mise à jour service :', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) return res.status(404).json({ error: "Service non trouvé." });

        // NOUVELLE PARTIE : Supprimer toutes les références au service d'abord
        const { OrderItemService, Review, CarouselItem, ServiceRole } = require('../models');
        
        // Supprimer les associations order_item_services
        await OrderItemService.destroy({
            where: { service_id: req.params.id }
        });
        
        // Supprimer les reviews liées au service
        await Review.destroy({
            where: { service_id: req.params.id }
        });
        
        // Supprimer les éléments de carousel liés au service
        await CarouselItem.destroy({
            where: { service_id: req.params.id }
        });
        
        // Supprimer les associations services-rôles
        await ServiceRole.destroy({
            where: { service_id: req.params.id }
        });

        // Maintenant supprimer le service
        await service.destroy();
        res.json({ message: "Service supprimé." });
    } catch (err) {
        console.error('Erreur suppression service :', err);
        res.status(500).json({ error: err.message });
    }
};

exports.checkServiceDependencies = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { OrderItemService, Review, CarouselItem, ServiceRole } = require('../models');
        
        // Vérifier les commandes qui utilisent ce service
        const orderItems = await OrderItemService.findAll({
            where: { service_id: serviceId },
            include: [{
                model: OrderItemService.sequelize.models.OrderItem,
                include: [{
                    model: OrderItemService.sequelize.models.Order,
                    attributes: ['id']
                }]
            }]
        });
        
        // Vérifier les avis
        const reviews = await Review.findAll({
            where: { service_id: serviceId },
            attributes: ['id']
        });
        
        // Vérifier les éléments de carousel
        const carouselItems = await CarouselItem.findAll({
            where: { service_id: serviceId },
            attributes: ['id']
        });
        
        // Vérifier les associations service-rôles
        const roleAssociations = await ServiceRole.findAll({
            where: { service_id: serviceId }
        });
        
        const dependencies = {
            orderItems: orderItems.length,
            reviews: reviews.length,
            carouselItems: carouselItems.length,
            roleAssociations: roleAssociations.length,
            canDelete: true,
            warnings: []
        };
        
        if (orderItems.length > 0) {
            dependencies.warnings.push(
                `${orderItems.length} commande(s) contienne(nt) ce service. Ces associations seront supprimées.`
            );
        }
        
        if (reviews.length > 0) {
            dependencies.warnings.push(
                `${reviews.length} avis concerne(nt) ce service. Ils seront supprimés.`
            );
        }
        
        if (carouselItems.length > 0) {
            dependencies.warnings.push(
                `${carouselItems.length} élément(s) du carousel utilise(nt) ce service. Ils seront supprimés.`
            );
        }
        
        if (roleAssociations.length > 0) {
            dependencies.warnings.push(
                `${roleAssociations.length} association(s) service-rôle sera(ont) supprimée(s).`
            );
        }
        
        res.json(dependencies);
    } catch (err) {
        console.error('Erreur vérification dépendances service :', err);
        res.status(500).json({ error: err.message });
    }
};
