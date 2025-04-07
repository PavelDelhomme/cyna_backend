const { Address, AddressUserProfile, UserProfile } = require('../models');

exports.addAddressToUser = async (req, res) => {
  try {
    const { address1, city, postalCode, type } = req.body;
    
    const address = await Address.create({
      address1,
      city,
      postal_code: postalCode,
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

exports.getUserAddresses = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: ['addresses']
    });
    
    res.json(userProfile.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
