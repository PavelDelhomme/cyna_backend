const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/authMiddleware');
const rev     = require('../controllers/reviewController');

router.get('/',       auth(['user','admin']), rev.listReviews);
router.post('/',      auth(['user','admin']), rev.createReview);
router.delete('/:id', auth(['admin']),        rev.deleteReview);

module.exports = router;
