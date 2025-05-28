const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const stype   = require('../controllers/serviceTypeController');

router.get('/', auth(['user','admin']), stype.listServiceTypes);
router.post('/', auth(['admin', 'user']), stype.createServiceType);

module.exports = router;
