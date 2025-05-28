const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const stype   = require('../../controllers/serviceTypeController');

router.use(auth(['admin']));

router.get('/', stype.listServiceTypes);
router.post('/', stype.createServiceType);

module.exports = router;
