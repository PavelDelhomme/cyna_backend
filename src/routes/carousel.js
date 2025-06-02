const express = require('express');
const router = express.Router();
const { CarouselItem } = require('../models');


router.get('/', async (req, res) => {
  const items = await CarouselItem.findAll();
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    const { product_id, service_id } = req.body;
    
    // Trouver le dernier ordre utilisé
    const lastItem = await CarouselItem.findOne({
      order: [['order', 'DESC']]
    });
    
    // Calculer le prochain ordre
    const nextOrder = lastItem ? lastItem.order + 1 : 1;
    
    // Créer le nouvel élément
    const item = await CarouselItem.create({ 
      product_id, 
      service_id, 
      order: nextOrder 
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Erreur lors de l\'ajout au carousel:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout au carousel' });
  }
});

router.put('/:id', async (req, res) => {
  const item = await CarouselItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.update(req.body);
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await CarouselItem.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.destroy();
  res.json({ success: true });
});

module.exports = router;