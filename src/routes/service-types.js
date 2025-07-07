const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const stype   = require('../controllers/serviceTypeController');

// Route publique pour lister les types de services
router.get('/', stype.listServiceTypes);

// Routes protégées pour l'administration
router.post('/', auth(['admin']), stype.createServiceType);
router.put('/:id', auth(['admin']), stype.updateServiceType);
router.delete('/:id', auth(['admin']), stype.deleteServiceType);
router.get('/:id/dependencies', auth(['admin']), stype.checkServiceTypeDependencies);

module.exports = router;
