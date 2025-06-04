const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const stype   = require('../controllers/serviceTypeController');

router.get('/', auth(['user','admin']), stype.listServiceTypes);
router.post('/', auth(['admin', 'user']), stype.createServiceType);
router.put('/:id', auth(['admin']), stype.updateServiceType);
router.delete('/:id', auth(['admin']), stype.deleteServiceType);
router.get('/:id/dependencies', auth(['admin']), stype.checkServiceTypeDependencies);

module.exports = router;
