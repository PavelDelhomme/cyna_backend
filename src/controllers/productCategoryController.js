

exports.listProductCategories = async (req, res) => {
    const categories = await ProductCategory.findAll();
    res.json(categories);
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
