const { Address, AddressUserProfile } = require('../models');
const UserProfile = require('../models');

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

// Voir toutes ses adresses
exports.getUserAddresses = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: ['addresses']
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profil utilisateur introuvable' });
    }
    
    res.json(userProfile.addresses);
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