const express = require('express');
const router = express.Router();

const statController = require('../controllers/statController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/stats', authMiddleware(['admin']), statController.listStats);
//router.post('/carts/create', authMiddleware(), cartController.createCart);
router.post('/stats/create/', authMiddleware(['admin']), statController.createStat);
router.patch('/stats/update/:statId', authMiddleware(['admin']), statController.updateStat);
router.delete('/stats/delete/:statId', authMiddleware(['admin']), statController.deleteStat);


module.exports = router;