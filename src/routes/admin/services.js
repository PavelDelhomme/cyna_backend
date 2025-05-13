const express = require('express');
const router = express.Router();
const devController = require('../../controllers/devController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-services', authMiddleware(['admin']), devController.listServices);
router.post('/create-service', authMiddleware(['admin']), devController.createService);
router.delete('/delete-service/:id', authMiddleware(['admin']), devController.deleteService);

module.exports = router;