const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const promo = require('../controllers/promoCodeController');

// Routes protégées par authentification admin
router.use(auth(['admin']));

// Routes CRUD de base
router
  .route('/')
  .get(promo.getAllPromoCodes)
  .post(promo.createPromoCode);

router
  .route('/:id')
  .put(promo.updatePromoCode)
  .delete(promo.deletePromoCode);

// Routes pour la gestion des associations avec les rôles
router
  .route('/:promoCodeId/roles/:roleId')
  .post(promo.associatePromoToRole)
  .delete(promo.removePromoFromRole);

// Route pour valider un code promo (accessible aux utilisateurs)
router.post('/validate', auth(['user', 'admin']), promo.validatePromoCode);

module.exports = router;
