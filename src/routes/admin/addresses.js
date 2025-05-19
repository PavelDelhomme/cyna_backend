// routes/admin/addresses.js
const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const addr    = require('../../controllers/addressController');

router.use(auth(['admin']));

router
  .route('/:id')
  .patch(addr.updateAddress)
  .delete(addr.deleteAddress);

module.exports = router;
