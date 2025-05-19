const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const ctrl    = require('../controllers/addressController');

// Toutes ces routes nécessitent un user authentifié
router.use(auth(['user', 'admin']));

// GET  /api/addresses/me      → liste SES adresses
router.get('/me',                 ctrl.getMyAddresses);

// POST /api/addresses           → ajoute une adresse à SON profil
router.post('/',                  ctrl.addAddressToUser);

// PATCH /api/addresses/:id      → modifie SON adresse
router.patch('/:id',              ctrl.updateUserAddress);

// DELETE /api/addresses/:id     → supprime SON adresse
router.delete('/:id',             ctrl.deleteUserAddress);

module.exports = router;
