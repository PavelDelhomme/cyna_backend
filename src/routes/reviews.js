const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const loadUserProfile = require('../middlewares/loadUserProfile');
const rev     = require('../controllers/reviewController');

// Routes générales
router.get('/',       auth(['user','admin']), rev.listReviews);
router.post('/',      auth(['user','admin']), loadUserProfile, rev.createReview);
router.put('/:id',    auth(['user','admin']), loadUserProfile, rev.updateReview);
router.delete('/:id', auth(['user','admin']), loadUserProfile, rev.deleteReview);

// Routes spécifiques par produit/service
router.get('/product/:productId',       rev.getReviewsByProduct);
router.get('/service/:serviceId',       rev.getReviewsByService);
router.get('/product/:productId/stats', rev.getReviewStats);
router.get('/service/:serviceId/stats', rev.getReviewStats);

module.exports = router;
