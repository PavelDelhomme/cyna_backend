const { Product, PromoCode, ProductCategory } = require('../models');


exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'category'
        },
        {
          model: PromoCode,
          as: 'promoCode'
        }
      ]
    });
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits :', err);
    res.status(500).json({ error: err.message });
  }
};


  // Créer un produit
exports.createProduct = async (req, res) => {
  try {
    console.log('Payload reçu pour création produit :', req.body);

    const { name, description, price, stock, category_id, promo_code_id } = req.body;

    // Vérifier si les champs obligatoires sont manquants (null ou undefined)
    if (name === undefined || name === null ||
        price === undefined || price === null ||
        stock === undefined || stock === null ||
        category_id === undefined || category_id === null) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price), // conversion explicite en nombre
      stock: parseInt(stock, 10), // conversion explicite en nombre
      category_id: parseInt(category_id, 10), // conversion explicite en nombre
      promo_code_id: promo_code_id ? parseInt(promo_code_id, 10) : null
    });

    const productWithAssociations = await Product.findByPk(product.id, {
      include: [
        {
          model: ProductCategory,
          as: 'category'
        },
        {
          model: PromoCode,
          as: 'promoCode'
        }
      ]
    });

    res.status(201).json(productWithAssociations);
  } catch (err) {
    console.error('Erreur création produit :', err);
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
    console.log('Payload reçu pour mise à jour produit :', req.body);
    
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé." });

    const { name, description, price, stock, category_id, promo_code_id } = req.body;

    // Préparation des données à mettre à jour
    const updateData = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      stock: stock ? parseInt(stock, 10) : undefined,
      category_id: category_id ? parseInt(category_id, 10) : undefined,
      promo_code_id: promo_code_id ? parseInt(promo_code_id, 10) : undefined
    };

    // Suppression des valeurs undefined
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    console.log('Données à mettre à jour :', updateData);

    await product.update(updateData);
    
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        {
          model: ProductCategory,
          as: 'category'
        },
        {
          model: PromoCode,
          as: 'promoCode'
        }
      ]
    });
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('Erreur détaillée mise à jour produit :', err);
    res.status(500).json({ 
      error: err.message,
      details: err.errors ? err.errors.map(e => e.message) : null
    });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé." });

    // NOUVELLE PARTIE : Supprimer toutes les références au produit d'abord
    const { OrderItemProduct, Review, CarouselItem } = require('../models');
    
    // Supprimer les associations order_item_products
    await OrderItemProduct.destroy({
      where: { product_id: req.params.id }
    });
    
    // Supprimer les reviews liées au produit
    await Review.destroy({
      where: { product_id: req.params.id }
    });
    
    // Supprimer les éléments de carousel liés au produit
    await CarouselItem.destroy({
      where: { product_id: req.params.id }
    });

    // Maintenant supprimer le produit
    await product.destroy();
    res.json({ message: "Produit supprimé." });
  } catch (err) {
    console.error('Erreur suppression produit :', err);
    res.status(500).json({ error: err.message });
  }
};

// Nouveau : Vérifier les dépendances avant suppression
exports.checkProductDependencies = async (req, res) => {
  try {
    const productId = req.params.id;
    const { OrderItemProduct, Review, CarouselItem } = require('../models');
    
    // Vérifier les commandes qui utilisent ce produit
    const orderItems = await OrderItemProduct.findAll({
      where: { product_id: productId }
    });
    
    // Vérifier les avis
    const reviews = await Review.findAll({
      where: { product_id: productId },
      attributes: ['id']
    });
    
    // Vérifier les éléments de carousel
    const carouselItems = await CarouselItem.findAll({
      where: { product_id: productId },
      attributes: ['id']
    });
    
    const dependencies = {
      orderItems: orderItems.length,
      reviews: reviews.length,
      carouselItems: carouselItems.length,
      canDelete: true,
      warnings: []
    };
    
    if (orderItems.length > 0) {
      dependencies.warnings.push(
        `${orderItems.length} commande(s) contienne(nt) ce produit. Ces associations seront supprimées.`
      );
    }
    
    if (reviews.length > 0) {
      dependencies.warnings.push(
        `${reviews.length} avis concerne(nt) ce produit. Ils seront supprimés.`
      );
    }
    
    if (carouselItems.length > 0) {
      dependencies.warnings.push(
        `${carouselItems.length} élément(s) du carousel utilise(nt) ce produit. Ils seront supprimés.`
      );
    }
    
    res.json(dependencies);
  } catch (err) {
    console.error('Erreur vérification dépendances produit :', err);
    res.status(500).json({ error: err.message });
  }
};

