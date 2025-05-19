// routes/admin/addresses.js
const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const ctrl    = require('../../controllers/addressController');

router.use(auth(['admin']));

// GET /api/admin/addresses           → liste TOUTES les adresses
router.get('/', ctrl.listAddresses);

// POST /api/admin/addresses/user/:userId
router.post('/user/:userId', ctrl.createAddressForUser);

// PATCH /api/admin/addresses/:id
router.patch('/:id', ctrl.updateAddress);

// DELETE /api/admin/addresses/:id
router.delete('/:id', ctrl.deleteAddress);

module.exports = router;
