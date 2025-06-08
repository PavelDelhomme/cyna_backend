const { Address, AddressUserProfile, UserProfile } = require('../models');


exports.listAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Ajouter une adresse à un utilisateur spécifique
exports.createAddressForUser = async (req, res) => {
    const { address1, city, postalCode, region, country, type} = req.body;
    const { userId } = req.params;

    try {
        const userProfile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!userProfile) {
            return res.status(404).json({ error: "Profil utilisateur introuvable" });
        }

        const address = await Address.create({ address1, city, postalCode, region, country, type });

        await AddressUserProfile.create({
            address_id: address.id,
            user_profile_id: userProfile.id
          });
        res.status(201).json({ message: "Adresse créée pour l'utilisateur", address });      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Modifier une adresse par ID (admin)
exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { address1, city, postalCode, region, country, type } = req.body;

    try {
        const address = await Address.findByPk(id);
        if (!address) {
        return res.status(404).json({ error: "Adresse introuvable" });
        }

        await address.update({ address1, city, postalCode, region, country, type });

        res.json({ message: "Adresse mise à jour", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Supprimer une adresse par ID (admin)
exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
  
    try {
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(404).json({ error: "Adresse introuvable" });
      }
  
      // Supprimer l'association
      await AddressUserProfile.destroy({ where: { address_id: id } });
  
      // Supprimer l'adresse
      await Address.destroy({ where: { id } });
  
      res.json({ message: "Adresse supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Obtention de toutes les adresses liées à mon profil
exports.getUserAddresses = async (req, res) => {
  try {
    // Sequelize vous génère automatiquement une méthode getAddresses()
    const addresses = await req.user.user_profile.getAddresses();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// alias plus clair
exports.getMyAddresses = exports.getUserAddresses;


// exports.getUserAddresses déjà présent, renommez‐le en getMyAddresses pour plus de clarté :
exports.getMyAddresses = exports.getUserAddresses;


exports.addAddressToUser = async (req, res) => {
  try {
    const { address1, city, postalCode, region, country, type } = req.body;
    
    const address = await Address.create({
      address1,
      city,
      postalCode,
      region,
      country,
      type
    });

    await AddressUserProfile.create({
      address_id: address.id,
      user_profile_id: req.user.user_profile.id
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Modifier une adresse par ID (si elle appartient au user)
exports.updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address1, city, postalCode, region, country, type } = req.body;

    const addressLink = await AddressUserProfile.findOne({
      where: { address_id: id, user_profile_id: req.user.user_profile.id }
    });

    if (!addressLink) {
      return res.status(403).json({ error: "Adresse non autorisée" });
    }

    const address = await Address.findByPk(id);
    if (!address) {
      return res.status(404).json({ error: "Adresse introuvable" });
    }

    await address.update({ address1, city, postalCode, region, country, type });

    res.json({ message: "Adresse mise à jour", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une adresse par ID (si elle appartient au user)
exports.deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const addressLink = await AddressUserProfile.findOne({
      where: { address_id: id, user_profile_id: req.user.user_profile.id }
    });

    if (!addressLink) {
      return res.status(403).json({ error: "Adresse non autorisée" });
    }

    await AddressUserProfile.destroy({
      where: { address_id: id, user_profile_id: req.user.user_profile.id }
    });

    await Address.destroy({
      where: { id }
    });

    res.json({ message: "Adresse supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les adresses d'un utilisateur
exports.getAddresses = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Address,
        as: 'addresses'
      }]
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profil utilisateur non trouvé' });
    }

    res.json(userProfile.addresses);
  } catch (error) {
    console.error('[ADDRESS] Erreur lors de la récupération des adresses:', error);
    res.status(500).json({ message: error.message });
  }
};

// Créer une nouvelle adresse
exports.createAddress = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profil utilisateur non trouvé' });
    }

    const address = await Address.create(req.body);
    await userProfile.addAddress(address);

    if (req.body.is_default) {
      await userProfile.addresses.forEach(async (addr) => {
        if (addr.id !== address.id) {
          await addr.update({ is_default: false });
        }
      });
    }

    console.log('[ADDRESS] Nouvelle adresse créée:', address.id);
    res.status(201).json(address);
  } catch (error) {
    console.error('[ADDRESS] Erreur lors de la création:', error);
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une adresse
exports.updateAddress = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Address,
        as: 'addresses',
        where: { id: req.params.id }
      }]
    });

    if (!userProfile || !userProfile.addresses.length) {
      console.warn('[ADDRESS] Adresse non trouvée:', req.params.id);
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    const address = userProfile.addresses[0];

    if (req.body.is_default) {
      await userProfile.addresses.forEach(async (addr) => {
        if (addr.id !== address.id) {
          await addr.update({ is_default: false });
        }
      });
    }

    await address.update(req.body);
    console.log('[ADDRESS] Adresse mise à jour:', address.id);
    res.json(address);
  } catch (error) {
    console.error('[ADDRESS] Erreur lors de la mise à jour:', error);
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une adresse
exports.deleteAddress = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: Address,
        as: 'addresses',
        where: { id: req.params.id }
      }]
    });

    if (!userProfile || !userProfile.addresses.length) {
      console.warn('[ADDRESS] Adresse non trouvée:', req.params.id);
      return res.status(404).json({ message: 'Adresse non trouvée' });
    }

    const address = userProfile.addresses[0];
    await userProfile.removeAddress(address);
    await address.destroy();

    console.log('[ADDRESS] Adresse supprimée:', req.params.id);
    res.json({ message: 'Adresse supprimée avec succès' });
  } catch (error) {
    console.error('[ADDRESS] Erreur lors de la suppression:', error);
    res.status(500).json({ message: error.message });
  }
};