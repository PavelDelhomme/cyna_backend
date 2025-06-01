const { Product, PromoCode } = require('../models');


exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


  // Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, promotion, category_id } = req.body;

    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      promotion,
      category_id
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.assignPromoToProduct = async (req, res) => {
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

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, promotion, category_id } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé." });

    await product.update({ name, description, price, stock, promotion, category_id });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé." });

    await product.destroy();
    res.json({ message: "Produit supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

