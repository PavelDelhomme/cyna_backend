const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const svc     = require('../controllers/serviceController');

router.get('/', auth(['user','admin']), svc.listServices);
router.post('/', auth(['admin']),        svc.createService);
router.put('/:id', auth(['admin']),      svc.updateService);
router.delete('/:id', auth(['admin']),   svc.deleteService);
router.get('/:id/dependencies', auth(['admin']), svc.checkServiceDependencies);

module.exports = router;
