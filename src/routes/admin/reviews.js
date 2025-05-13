const express = require('express');
const router = express.Router();
const devController = require('../../controllers/devController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/list-reviews', authMiddleware(['admin']), devController.listReviews);
router.post('/create-review', authMiddleware(['admin']), devController.createReview);
router.delete('/delete-review/:id', authMiddleware(['admin']), devController.deleteReview);

module.exports = router;