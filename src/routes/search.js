const express = require('express');
const router = express.Router();
const { Product, Service, ProductCategory, PromoCode, ServiceType } = require('../models');
const { Op } = require('sequelize');

// Route de recherche
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Le paramètre de recherche est requis' });
    }

    console.log('Recherche pour:', q);

    // Recherche dans les produits
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
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

    console.log('Produits trouvés:', products.length);

    // Recherche dans les services
    const services = await Service.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: ServiceType,
          as: 'serviceType'
        },
        {
          model: PromoCode,
          as: 'promoCode'
        }
      ]
    });

    console.log('Services trouvés:', services.length);

    // Combiner les résultats
    const results = {
      products: products.map(p => ({
        ...p.toJSON(),
        type: 'product'
      })),
      services: services.map(s => ({
        ...s.toJSON(),
        type: 'service'
      }))
    };

    console.log('Résultats combinés:', {
      totalProducts: results.products.length,
      totalServices: results.services.length
    });

    res.json(results);
  } catch (error) {
    console.error('Erreur détaillée lors de la recherche:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Erreur lors de la recherche',
      details: error.message
    });
  }
});

module.exports = router; 