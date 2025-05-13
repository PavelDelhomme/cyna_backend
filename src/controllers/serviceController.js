const { Service, ServiceType } = require('../models');

exports.listServices = async (req, res) => {
    const services = await Service.findAll();
    res.json(services);
};

exports.listServiceTypes = async (req, res) => {
    const serviceTypes = await ServiceType.findAll();
    res.json(serviceTypes);
};

exports.createService = async (req, res) => {
  try {
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
      price,
      status,
      subscription,
      subscriptionType,
      userCount,
      promotion,
      service_type_id
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createServiceType = async (req, res) => {
  try {
    const {
      name, description, created_at, updated_at
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const service = await Service.create({
        name,
        description, 
        created_at, 
        updated_at
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        const {
          name, description, price, status, subscription,
          subscriptionType, userCount, promotion, service_type_id
        } = req.body;


        if (!service) {
            return res.status(404).json({ error: "Service inexistant"});
        }


        if (!name || !price || !service_type_id) {
        return res.status(400).json({ error: "Champs obligatoires manquants." });
        }

        await service.update({
          name,
          description,
          price,
          status,
          subscription,
          subscriptionType,
          userCount,
          promotion,
          service_type_id
        });

        res.json({ message: "Service mise à jour", service });
    } catch (error) {
        console.error("[serviceController.js] Erreur updateService", error);
        res.status(500).json({ error: error.message });
    }
};



exports.updateServiceType = async (req, res) => {
    try {
        const serviceType = await ServiceType.findByPk(req.params.id);
        const {
          name, description, updated_at
        } = req.body;


        if (!serviceType) {
            return res.status(404).json({ error: "ServiceType inexistant"});
        }

        await serviceType.update({
          name, description, updated_at
        });

        res.json({ message: "ServiceType mise à jour", serviceType });
    } catch (error) {
        console.error("[serviceController.js] Erreur updateServiceType", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);

        if (!service) {
            return res.status(404).json({ error: "Service inexistant" });
        }

  
        await service.destroy();

        res.json({ message: "Service supprimé" });
    } catch (error) {
        console.error("[serviceController.js] Erreur deleteService", error);
        res.status(500).json({ error: error.message });
    }
}


exports.deleteServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByPk(req.params.id, {
      include: [Service] // Inclure les services associés
    });

    if (!serviceType) {
      return res.status(404).json({ error: "ServiceType inexistant" });
    }

    // Supprimer tous les services liés
    await Service.destroy({
      where: { service_type_id: serviceType.id }
    });

    // Puis supprimer le serviceType
    await serviceType.destroy();

    res.json({ message: "ServiceType et Services associés supprimés" });
  } catch (error) {
    console.error("[serviceTypeController.js] Erreur deleteServiceType", error);
    res.status(500).json({ error: error.message });
  }
};