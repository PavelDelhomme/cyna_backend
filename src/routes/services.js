const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const svc     = require('../controllers/serviceController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', auth(['user','admin']), svc.listServices);
router.post('/', upload.single('image'), auth(['admin']), svc.createService);
router.put('/:id', upload.single('image'), auth(['admin']), svc.updateService);
router.delete('/:id', auth(['admin']),   svc.deleteService);
router.get('/:id/dependencies', auth(['admin']), svc.checkServiceDependencies);

module.exports = router;
