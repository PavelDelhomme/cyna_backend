const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const svc     = require('../../controllers/serviceController');

router.use(auth(['admin','seller']));

router.get('/', svc.listServices);
router.post('/', svc.createService);

module.exports = router;
