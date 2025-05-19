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


// Obtention de toutes les adresses liés a un utilisateur (via son profil)
exports.getUserAddresses = async (req, res) => {
    try {
        const profile = req.user.user_profile;
        if (!profile) {
        return res.status(404).json({ error: "Profil utilisateur introuvable" });
        }

        const addresses = await Address.findAll({
          include: [{
              model: AddressUserProfile,
              where: { user_profile_id: profile.id }
          }]
        });

        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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