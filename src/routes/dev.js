const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { signup, login, refreshToken } = require('../controllers/authController');
const refreshTokenAuth = refreshToken;
const authMiddleware = require("../middlewares/authMiddleware");
const devController = require('../controllers/devController');
const roleController = require("../controllers/roleController");

const { User, Role, UserProfile } = require('../models');

// --- Helper Token ---
function generateTokens(user) {
  const token = jwt.sign({ userId: user.id, role: user.role?.name || 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '365d' });
  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });
  console.log(`[TOKEN] ${user.email} | Rôle: ${user.role?.name || 'admin'}`);
  return { token, refreshToken };
}

// --- Auth ---
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshTokenAuth);


// ✅ Dev admin auto
router.get('/dev-admin', async (req, res) => { 
  try {
    console.log("[/dev-admin] Initialisation admin...");
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
    const [user] = await User.findOrCreate({
      where: { email: 'admin@cyna.dev' },
      defaults: { name: 'Admin Dev', password: 'azerty123', role_id: adminRole.id }
    });
    
    if (user.role_id !== adminRole.id) {
      console.log("[/dev-admin] Correction du rôle admin sur user existant...");
      user.role_id = adminRole.id;
      await user.save();
    }

    await user.reload({ include: [{ model: Role, as: 'role' }] });
    await UserProfile.findOrCreate({ where: { user_id: user.id } });

    const { token, refreshToken } = generateTokens(user);
    res.json({ token, refreshToken, userId: user.id });
  } catch (err) {
    console.error("[/dev-admin] ERREUR :", err);
    res.status(500).json({ error: "Erreur création admin" });
  }
});

router.get('/admin-only', authMiddleware(['admin']), (req, res) => res.json({ message: "Accès autorisé", user: req.user }));



// --- Gestion utilisateurs & rôles ---
router.post('/users', authMiddleware(['admin']), devController.createUser);
router.get('/users', authMiddleware(['admin']), devController.listUsers);
router.get('/profiles', authMiddleware(['admin']), devController.listProfiles);
router.post('/admin/profile', authMiddleware(['admin']), devController.createAdminProfile);

router.get('/roles', authMiddleware(['admin']), devController.listRoles);
router.post('/roles', authMiddleware(['admin']), roleController.createRole);
router.delete('/roles/:id', authMiddleware(['admin']), devController.deleteRole);
router.post('/assignRole/:userId', authMiddleware(['admin']), devController.assignRoleToUser);

// --- Génériques GET + POST + DELETE ---
const resources = [
  'products', 'services', 'payments', 'tickets', 'orders', 'carts',
  'promoCodes', 'reviews', 'stats', 'serviceTypes', 'productCategories',
  'addresses', 'invoices', 'chatbots', 'chatbotHistories'
];

resources.forEach(resource => {
  const kebabRoute = resource.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
  const ucResource = resource.charAt(0).toUpperCase() + resource.slice(1);
  if (devController[`list${ucResource}`]) router.get(`/${kebabRoute}`, authMiddleware(['admin']), devController[`list${ucResource}`]);
  if (devController[`create${ucResource}`]) router.post(`/${kebabRoute}`, authMiddleware(['admin']), devController[`create${ucResource}`]);
  if (devController[`delete${ucResource}`]) router.delete(`/${kebabRoute}/:id`, authMiddleware(['admin']), devController[`delete${ucResource}`]);
});

// --- Routes métiers spéciales ---
// Promo -> Produit / Service / Catégorie
router.post('/promo-codes/:promoId/product/:productId', authMiddleware(['admin']), devController.assignPromoToProduct);
router.post('/promo-codes/:promoId/service/:serviceId', authMiddleware(['admin']), devController.assignPromoToService);
router.post('/promo-codes/:promoId/product-category/:categoryId', authMiddleware(['admin']), devController.assignPromoToProductCategory);
router.post('/promo-codes/:promoId/category/:categoryId', authMiddleware(['admin']), devController.assignPromoToProductCategory);

// Carts -> Ajout spécifique
router.post('/carts/:cartId/add-product/:productId', authMiddleware(['admin']), devController.addProductToCart);
router.post('/carts/:cartId/add-service/:serviceId', authMiddleware(['admin']), devController.addServiceToCart);
router.post('/carts/user/:userId', authMiddleware(['admin']), devController.createCartForUser);

// Addresses -> Ajout / Update
router.post('/addresses/:userId', authMiddleware(['admin']), devController.createAddressForUser);
router.patch('/addresses/:id', authMiddleware(['admin']), devController.updateAddress);

// --- Divers ---
router.get('/tokens', authMiddleware(['admin']), devController.listUserTokens);
router.get('/getUserAddresses/:userId', authMiddleware(['admin']), devController.getUserAddresses);
router.post('/fix-profiles', authMiddleware(['admin']), devController.fixProfiles);

// --- Nettoyage utilisateurs ---
router.delete('/reset-users', authMiddleware(['admin']), devController.resetUsers);


// --- Reviews ---
router.post('/reviews', authMiddleware(['admin', 'user']), devController.createReview);


module.exports = router;