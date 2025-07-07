const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const stat    = require('../controllers/statController');

router.get('/',    auth(['user','admin']), stat.listStats);
router.post('/',   auth(['admin']),        stat.createStat);

module.exports = router;
