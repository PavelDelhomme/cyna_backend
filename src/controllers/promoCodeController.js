const { PromoCode, RolePromoCode } = require('../models');

exports.createPromoCode = async (req, res) => {
  try {
    const { name, benefit, status } = req.body;
    const promoCode = await PromoCode.create({ name, benefit, status });
    res.status(201).json(promoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.associatePromoToRole = async (req, res) => {
  try {
    const { promoCodeId, roleId } = req.params;
    
    await RolePromoCode.create({
      promo_code_id: promoCodeId,
      role_id: roleId
    });

    res.status(201).json({ message: 'Association créée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
