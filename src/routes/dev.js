const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { signup, login, refreshToken } = require('../controllers/authController');
const devController = require('../controllers/devController');
const roleController = require("../controllers/roleController");

// --- Routes existantes reset-users ---
const { User, Role, UserProfile } = require('../models');


router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);


// ✅ ROUTE DE CRÉATION AUTOMATIQUE D'ADMIN + PROFIL + TOKEN AVEC RÔLE
router.get('/dev-admin', async (req, res) => { 
  try {
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });

    const [user] = await User.findOrCreate({
      where: { email: 'admin@cyna.dev' },
      defaults: {
        name: 'Admin Dev',
        password: 'azerty123',
        role_id: adminRole.id
      }
    });

    // Forcer le rôle si manquant ou incohérent
    if (!user.role_id || user.role_id !== adminRole.id) {
      user.role_id = adminRole.id;
      await user.save();
    }

    await user.reload({ include: [{ model: Role, as: 'role' }] });

    // ✅ Crée le profil admin s'il n'existe pas
    await UserProfile.findOrCreate({ where: { user_id: user.id } });

    // ✅ Inclut le rôle dans le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role?.name || 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '365d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '365d' }
    );

    res.json({ token, refreshToken, userId: user.id });

  } catch (err) {
    console.error(err);
    console.error("[DEV-ADMIN ERROR dans src/routes/dev.js]", err);
    res.status(500).json({ error: "Erreur création admin" });
  }
});


console.log("✅ Route GET /api/dev/dev-admin active");

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
// Ajouter route POST pour création utilisateur (admin)
router.post('/users', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [role] = await Role.findOrCreate({ where: { name: 'user' } });

    const user = await User.create({
      name, email, password, role_id: role.id
    });

    await UserProfile.create({ user_id: user.id });

    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur création utilisateur admin" });
  }
});

router.get('/profiles', authMiddleware(['admin']), devController.listProfiles);

// --- Products
router.get('/products', authMiddleware(['admin']), devController.listProducts);
router.post('/products', authMiddleware(['admin']), devController.createProduct);

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
router.post('/services', authMiddleware(['admin']), devController.createService);


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

// Payments
router.get('/payments', authMiddleware(['admin']), devController.listPayments);
router.post('/payments', authMiddleware(['admin']), devController.createPayment);

// Tickets
router.get('/tickets', authMiddleware(['admin']), devController.listTickets);
router.post('/tickets', authMiddleware(['admin']), devController.createTicket);

// Orders
router.get('/orders', authMiddleware(['admin']), devController.listOrders);
router.post('/orders', authMiddleware(['admin']), devController.createOrder);

// Carts
router.get('/carts', authMiddleware(['admin']), devController.listCarts);
router.post('/carts', authMiddleware(['admin']), devController.createCart);
router.post('/carts/:cartId/add-product/:productId', authMiddleware(['admin']), devController.addProductToCart);
router.post('/carts/:cartId/add-service/:serviceId', authMiddleware(['admin']), devController.addServiceToCart);
router.post('/carts/:cartId/product/:productId', authMiddleware(['admin']), devController.addProductToCart);
router.post('/carts/:cartId/service/:serviceId', authMiddleware(['admin']), devController.addServiceToCart);
router.post('/carts/user/:userId', authMiddleware(['admin']), devController.createCartForUser);

// PromoCodes
router.get('/promo-codes', authMiddleware(['admin']), devController.listPromoCodes);
router.post('/promo-codes', authMiddleware(['admin']), devController.createPromoCode);

// Associer un code promo à un produit
router.post('/promo-codes/:promoId/product/:productId', authMiddleware(['admin']), devController.assignPromoToProduct);

// Associer un code promo à un service
router.post('/promo-codes/:promoId/service/:serviceId', authMiddleware(['admin']), devController.assignPromoToService);

// Associer un code promo à une catégorie de produit
router.post('/promo-codes/:promoId/product-category/:categoryId', authMiddleware(['admin']), devController.assignPromoToProductCategory);
router.post('/promo-codes/:promoId/category/:categoryId', authMiddleware(['admin']), devController.assignPromoToProductCategory);

// Reviews
router.get('/reviews', authMiddleware(['admin']), devController.listReviews);
router.post('/reviews', authMiddleware(['admin']), devController.createReview);

// Stats
router.get('/stats', authMiddleware(['admin']), devController.listStats);
router.post('/stats', authMiddleware(['admin']), devController.createStat);

router.get('/service-types', authMiddleware(['admin']), devController.listServiceTypes);

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


router.get('/tokens', authMiddleware(['admin']), devController.listUserTokens);

router.get('/getUserAddresses/:userId', authMiddleware(['admin']), devController.getUserAddresses);
router.post('/assignRole/:userId', authMiddleware(['admin']), devController.assignRoleToUser);

router.get('/roles', authMiddleware(['admin']), devController.listRoles);

router.post('/roles', authMiddleware(['admin']), roleController.createRole);
router.delete('/roles/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const roleId = req.params.id;

    const { Role } = require('../models');
    const deleted = await Role.destroy({ where: { id: roleId } });

    if (deleted) {
      res.json({ message: "Rôle supprimé." });
    } else {
      res.status(404).json({ error: "Rôle introuvable." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Route de test protégée (admin only)
router.get('/admin-only', authMiddleware(['admin']), (req, res) => {
  res.json({
    message: "Accès autorisé (admin)",
    user: req.user
  });
});


router.post('/fix-profiles', async (req, res) => {
  const users = await require('../models').User.findAll();
  const created = [];

  for (const user of users) {
    const [profile, isNew] = await UserProfile.findOrCreate({
      where: { user_id: user.id }
    });
    if (isNew) created.push(user.email);
  }

  res.json({ message: "Profils vérifiés", newlyCreated: created });
});

module.exports = router;
