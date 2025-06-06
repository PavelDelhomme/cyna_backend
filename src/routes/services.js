const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const svc     = require('../controllers/serviceController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Route publique pour lister les services
router.get('/', svc.listServices);

// Routes protégées pour l'administration
router.post('/', auth(['admin']), upload.single('image'), svc.createService);
router.put('/:id', auth(['admin']), upload.single('image'), svc.updateService);
router.delete('/:id', auth(['admin']), svc.deleteService);
router.get('/:id/dependencies', auth(['admin']), svc.checkServiceDependencies);

module.exports = router;
