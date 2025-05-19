const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const svc     = require('../controllers/serviceController');

router.get('/', auth(['user','admin']), svc.listServices);
router.post('/', auth(['admin']),        svc.createService);

module.exports = router;
