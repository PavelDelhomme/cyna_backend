const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/services', authMiddleware(['admin, user']), serviceController.listServices);
router.get('/serviceTypes', authMiddleware(['admin, user']), serviceController.listServiceTypes);
router.post('/services/create/', authMiddleware(['admin']), serviceController.createService);
router.post('/serviceTypes/create/', authMiddleware(['admin']), serviceController.createServiceType);
router.patch('/services/update/:serviceId', authMiddleware(['admin']), serviceController.updateService);
router.patch('/serviceTypes/update/:serviceTypeId', authMiddleware(['admin']), serviceController.updateServiceType);
router.delete('/services/delete/:serviceId', authMiddleware(['admin']), serviceController.deleteService);
router.delete('/serviceTypes/delete/:serviceId', authMiddleware(['admin']), serviceController.deleteServiceType);


module.exports = router;