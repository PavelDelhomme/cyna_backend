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
router.get('/products', authMiddleware(['admin']), devController.listProducts);
router.get('/services', authMiddleware(['admin']), devController.listServices);
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

module.exports = router;
