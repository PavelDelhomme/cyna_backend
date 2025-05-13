const { PromoCode, RolePromoCode } = require('../models');

exports.createPromoCode = async (req, res) => {
    try {
      const { code, discount, expiresAt } = req.body;
      const promo = await PromoCode.create({ code, discount, expiresAt });
      res.status(201).json(promo);
    } catch (err) {
      res.status(500).json({ error: err.message });
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

//New

exports.listPromoCodes = async (req, res) => {
    const promoCodes = await PromoCode.findAll();
    res.json(promoCodes);
};


exports.assignPromoToProduct = async (req, res) => {
  const { PromoCode, Product } = require('../models');
  const { promoId, productId } = req.params;
  try {
    const promo = await PromoCode.findByPk(promoId);
    const product = await Product.findByPk(productId);
    if (!promo || !product) return res.status(404).json({ error: "Promo ou produit non trouvé." });

    await product.update({ promo_code_id: promo.id });
    res.json({ message: "Code promo appliqué au produit." });
  } catch (err) {
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



exports.assignPromoToProductCategory = async (req, res) => {
  const { promoId, categoryId } = req.params;
  try {
    const promo = await PromoCode.findByPk(promoId);
    const category = await ProductCategory.findByPk(categoryId);
    if (!promo || !category) return res.status(404).json({ error: "Promo ou catégorie non trouvée." });

    await category.update({ promo_code_id: promo.id });
    res.json({ message: "Code promo appliqué à la catégorie." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updatePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findByPk(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ error: "PromoCode non trouvé"});
        }
        
        await promoCode.update(req.body);

        res.json({ message: "PromoCode mis à jour", promoCode });
    } catch (error) {
        console.error("[PromoCodeController.js] Erreur updatePromoCode", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deletePromoCode = async (req, res) => {
    try {
        const promoCode = await PromoCode.findByPk(req.params.id);

        if (!promoCode) {
            return res.status(404).json({ error: "PromoCode inexistant" });
        }

  
        await promoCode.destroy();

        res.json({ message: "PromoCode supprimé" });
    } catch (error) {
        console.error("[promoCodeController.js Erreur deletePromoCode", error);
        res.status(500).json({ error: error.message });
    }
}
