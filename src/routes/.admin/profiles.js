const express = require("express");
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const profCtrl = require("../../controllers/profileController");

router.use(auth(['admin']));

/**
 * GET  /api/admin/profiles
 * → liste tous les profils
 */
router.get('/', profCtrl.listProfiles);

/**
 * GET /api/admin/profile
 * → récupérer le profile de l'utilisateur courant donc l'administrateur ?
 */
router.get('/me', profCtrl.getMyProfile);

/**
 * POST /api/admin/profiles/fix
 * → vérifie/crée tous les profils manquants
 */
router.post('/fix', profCtrl.fixProfiles);

/**
 * POST /api/admin/profiles/admin
 * → crée le profil pour l’admin (si jamais)
 */
router.post('/admin', profCtrl.createAdminProfile);

module.exports = router;