const { ServiceType } = require('../models');

exports.listServiceTypes = async (req, res) => {
    try {
        const serviceTypes = await ServiceType.findAll();
        res.json(serviceTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createServiceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const st = await ServiceType.create({ name, description });
    res.status(201).json(st);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateServiceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const type = await ServiceType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ error: "Type de service non trouvé." });
    type.name = name;
    type.description = description;
    await type.save();
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteServiceType = async (req, res) => {
  try {
    const type = await ServiceType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ error: "Type de service non trouvé." });
    
    const { Service, ServiceTypeRole } = require('../models');
    
    // Vérifier s'il y a des services qui utilisent ce type
    const servicesUsingType = await Service.findAll({
      where: { service_type_id: req.params.id },
      attributes: ['id', 'name']
    });
    
    if (servicesUsingType.length > 0) {
      return res.status(400).json({ 
        error: `Impossible de supprimer ce type de service.`,
        message: `${servicesUsingType.length} service(s) utilise(nt) encore ce type.`,
        suggestion: "Vous devez d'abord déplacer ces services vers un autre type ou les supprimer.",
        services: servicesUsingType.map(s => ({ id: s.id, name: s.name }))
      });
    }
    
    // Supprimer les associations servicetypes-rôles
    await ServiceTypeRole.destroy({
      where: { service_type_id: req.params.id }
    });
    
    await type.destroy();
    res.json({ message: "Type de service supprimé avec succès." });
  } catch (err) {
    console.error('Erreur suppression type de service :', err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkServiceTypeDependencies = async (req, res) => {
  try {
    const serviceTypeId = req.params.id;
    const { Service, ServiceTypeRole } = require('../models');
    
    // Vérifier les services qui utilisent ce type
    const services = await Service.findAll({
      where: { service_type_id: serviceTypeId },
      attributes: ['id', 'name']
    });
    
    // Vérifier les associations servicetype-rôles
    const roleAssociations = await ServiceTypeRole.findAll({
      where: { service_type_id: serviceTypeId }
    });
    
    const dependencies = {
      services: services.map(s => ({ id: s.id, name: s.name })),
      roleAssociations: roleAssociations.length,
      canDelete: services.length === 0, // ← Suppression possible seulement si aucun service
      warnings: []
    };
    
    if (services.length > 0) {
      dependencies.warnings.push(
        `❌ SUPPRESSION IMPOSSIBLE : ${services.length} service(s) utilise(nt) ce type.`
      );
      dependencies.warnings.push(
        `💡 Vous devez d'abord déplacer ces services vers un autre type ou les supprimer.`
      );
    }
    
    if (roleAssociations.length > 0) {
      dependencies.warnings.push(
        `${roleAssociations.length} association(s) type-rôle sera(ont) supprimée(s).`
      );
    }
    
    if (services.length === 0 && roleAssociations.length === 0) {
      dependencies.warnings.push(
        `✅ Aucune dépendance détectée. Suppression possible.`
      );
    }
    
    res.json(dependencies);
  } catch (err) {
    console.error('Erreur vérification dépendances type de service :', err);
    res.status(500).json({ error: err.message });
  }
};