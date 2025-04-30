const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const devController = require('../controllers/devController');

// --- Routes existantes reset-users ---
const { User, UserProfile } = require('../models');

router.delete('/reset-users', async (req, res) => {
  try {
    const adminUser = await User.findOne({ where: { email: 'admin@cyna.dev' } });

    if (!adminUser) return res.status(404).json({ error: "Admin introuvable." });

    await UserProfile.destroy({
      where: { user_id: { [require('sequelize').Op.ne]: adminUser.id } }
    });

    await User.destroy({
      where: { id: { [require('sequelize').Op.ne]: adminUser.id } }
    });

    res.json({ message: "Tous les utilisateurs (sauf admin) supprimés." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors du reset" });
  }
});

// --- Nouvelles routes liste Admin ---

router.get('/users', authMiddleware(['admin']), devController.listUsers);
router.get('/profiles', authMiddleware(['admin']), devController.listProfiles);

// --- Products
router.get('/products', authMiddleware(['admin']), devController.listProducts);
router.post('/products', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, description, price, stock, promotion, category_id } = req.body;
    const product = await require('../models').Product.create({ name, description, price, stock, promotion, category_id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Liste des catégories
router.get('/product-categories', authMiddleware(['admin']), devController.listProductCategories);

// Création d'une catégorie
router.post('/product-categories', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    const { ProductCategory } = require('../models');
    const existing = await ProductCategory.findOne({ where: { name } });

    if (existing) return res.status(200).json(existing);

    const newCat = await ProductCategory.create({ name, description });
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/services', authMiddleware(['admin']), devController.listServices);

router.post('/services', authMiddleware(['admin']), async (req, res) => {
  try {
    const {
      name, description, price, status, subscription,
      subscriptionType, userCount, promotion, service_type_id
    } = req.body;

    const service = await require('../models').Service.create({
      name,
      description,
      price,
      status,
      subscription,
      subscriptionType,
      userCount,
      promotion,
      service_type_id
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/service-types', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    const { ServiceType } = require('../models');
    const existing = await ServiceType.findOne({ where: { name } });

    if (existing) return res.status(200).json(existing);

    const newType = await ServiceType.create({ name, description });
    res.status(201).json(newType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/payments', authMiddleware(['admin']), devController.listPayments);
router.get('/tickets', authMiddleware(['admin']), devController.listTickets);
router.get('/orders', authMiddleware(['admin']), devController.listOrders);
router.get('/carts', authMiddleware(['admin']), devController.listCarts);
router.get('/promo-codes', authMiddleware(['admin']), devController.listPromoCodes);
router.get('/reviews', authMiddleware(['admin']), devController.listReviews);
router.get('/stats', authMiddleware(['admin']), devController.listStats);
router.get('/service-types', authMiddleware(['admin']), devController.listServiceTypes);
router.get('/product-categories', authMiddleware(['admin']), devController.listProductCategories);

// Addresses
router.get('/addresses', authMiddleware(['admin']), devController.listAddresses);
// Créer une adresse pour un user spécifique
router.post('/addresses/:userId', authMiddleware(['admin']), devController.createAddressForUser);
// Modifier une adresse
router.patch('/addresses/:id', authMiddleware(['admin']), devController.updateAddress);
// Supprimer une adresse
router.delete('/addresses/:id', authMiddleware(['admin']), devController.deleteAddress);

router.get('/invoices', authMiddleware(['admin']), devController.listInvoices);
router.get('/chatbots', authMiddleware(['admin']), devController.listChatbots);
router.get('/chatbot-histories', authMiddleware(['admin']), devController.listChatbotHistories);


// Ajoute dans dev.js temporairement :
router.post('/admin/profile', async (req, res) => {
  const admin = await User.findOne({ where: { email: 'admin@cyna.dev' } });
  if (!admin) return res.status(404).json({ error: 'Admin introuvable' });

  const existingProfile = await UserProfile.findOne({ where: { user_id: admin.id } });
  if (existingProfile) return res.json({ message: "Profil déjà existant" });

  const profile = await UserProfile.create({ user_id: admin.id });
  res.json({ message: "Profil admin créé", profile });
});


module.exports = router;


// Supprimer un produit
router.delete('/products/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { Product } = require('../models');
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Produit supprimé avec succès." });
    } else {
      res.status(404).json({ error: "Produit non trouvé." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un service
router.delete('/services/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { Service } = require('../models');
    const deleted = await Service.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Service supprimé avec succès." });
    } else {
      res.status(404).json({ error: "Service non trouvé." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
