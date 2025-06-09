const express = require('express');
const router = express.Router();
const { Product, Service, PromoCode } = require('../models');

// Route pour obtenir les détails d'un produit
router.get('/product/:id', async (req, res) => {
  console.log('GET /product/:id', req.params.id);
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: PromoCode,
          as: 'promoCode',
          attributes: ['code', 'discount_value', 'start_date', 'end_date']
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour obtenir les détails d'un service
router.get('/service/:id', async (req, res) => {
  console.log('GET /service/:id', req.params.id);
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          model: PromoCode,
          as: 'promoCode',
          attributes: ['code', 'discount_percentage', 'start_date', 'end_date']
        }
      ]
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
