const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const addr    = require('../controllers/addressController');

router.get('/',  auth(['admin']), addr.listAddresses);
router.post('/', auth(['admin']), addr.createAddressForUser);

module.exports = router;
