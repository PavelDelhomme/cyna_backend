const { PromoCode, RolePromoCode, Order, Role } = require('../models');

exports.listPromoCodes = async (req, res) => {
    const promoCodes = await PromoCode.findAll();
    res.json(promoCodes);
};

exports.createPromoCode = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUses,
      isActive
    } = req.body;

    // Vérifier si le code existe déjà
    const existingCode = await PromoCode.findOne({ where: { code } });
    if (existingCode) {
      return res.status(400).json({ error: 'Ce code promo existe déjà' });
    }

    // Valider les dates
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'La date de début doit être antérieure à la date de fin' });
    }

    // Valider le type de réduction
    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ error: 'Le pourcentage de réduction doit être entre 0 et 100' });
    }

    const promoCode = await PromoCode.create({
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUses,
      currentUses: 0,
      isActive: isActive ?? true
    });

    res.status(201).json(promoCode);
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la création du code promo :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUses,
      isActive
    } = req.body;

    const promoCode = await PromoCode.findByPk(id);
    if (!promoCode) {
      return res.status(404).json({ error: 'Code promo non trouvé' });
    }

    // Vérifier si le nouveau code existe déjà (sauf pour le code actuel)
    if (code !== promoCode.code) {
      const existingCode = await PromoCode.findOne({ where: { code } });
      if (existingCode) {
        return res.status(400).json({ error: 'Ce code promo existe déjà' });
      }
    }

    // Mise à jour des champs
    await promoCode.update({
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      maxUses,
      isActive
    });

    res.json(promoCode);
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la mise à jour du code promo :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await PromoCode.findByPk(id);
    
    if (!promoCode) {
      return res.status(404).json({ error: 'Code promo non trouvé' });
    }

    await promoCode.destroy();
    res.json({ message: 'Code promo supprimé avec succès' });
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la suppression du code promo :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.associatePromoToRole = async (req, res) => {
  try {
    const { promoCodeId, roleId } = req.params;
    
    // Vérifier si l'association existe déjà
    const existingAssociation = await RolePromoCode.findOne({
      where: { promo_code_id: promoCodeId, role_id: roleId }
    });

    if (existingAssociation) {
      return res.status(400).json({ error: 'Cette association existe déjà' });
    }

    await RolePromoCode.create({
      promo_code_id: promoCodeId,
      role_id: roleId
    });

    res.status(201).json({ message: 'Association créée avec succès' });
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de l'association du code promo :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.removePromoFromRole = async (req, res) => {
  try {
    const { promoCodeId, roleId } = req.params;
    
    const association = await RolePromoCode.findOne({
      where: { promo_code_id: promoCodeId, role_id: roleId }
    });

    if (!association) {
      return res.status(404).json({ error: 'Association non trouvée' });
    }

    await association.destroy();
    res.json({ message: 'Association supprimée avec succès' });
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la suppression de l'association :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount, userId } = req.body;

    const promoCode = await PromoCode.findOne({
      where: { code },
      include: [{
        model: RolePromoCode,
        as: 'roles',
        include: [{
          model: Role,
          as: 'role'
        }]
      }]
    });

    if (!promoCode) {
      return res.status(404).json({ error: 'Code promo non trouvé' });
    }

    // Vérifier si le code est actif
    if (!promoCode.isActive) {
      return res.status(400).json({ error: 'Ce code promo n\'est plus actif' });
    }

    // Vérifier les dates de validité
    const now = new Date();
    if (promoCode.startDate && new Date(promoCode.startDate) > now) {
      return res.status(400).json({ error: 'Ce code promo n\'est pas encore valide' });
    }
    if (promoCode.endDate && new Date(promoCode.endDate) < now) {
      return res.status(400).json({ error: 'Ce code promo a expiré' });
    }

    // Vérifier le montant minimum de commande
    if (promoCode.minOrderAmount && orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        error: `Le montant minimum de commande est de ${promoCode.minOrderAmount}€`
      });
    }

    // Vérifier la limite d'utilisation
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return res.status(400).json({ error: 'Ce code promo a atteint sa limite d\'utilisation' });
    }

    // Calculer la réduction
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = orderAmount * (promoCode.discountValue / 100);
      if (promoCode.maxDiscountAmount) {
        discount = Math.min(discount, promoCode.maxDiscountAmount);
      }
    } else {
      discount = promoCode.discountValue;
    }

    res.json({
      valid: true,
      discount,
      finalAmount: orderAmount - discount,
      promoCode
    });
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la validation du code promo :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.findAll({
      include: [{
        model: Role,
        as: 'roles'
      }]
    });
    res.json(promoCodes);
  } catch (error) {
    console.error("[promoCodeController] Erreur lors de la récupération des codes promo :", error);
    res.status(500).json({ error: error.message });
  }
};