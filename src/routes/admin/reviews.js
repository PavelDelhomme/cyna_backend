const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const rev     = require('../../controllers/reviewController');

router.use(auth(['admin','seller']));

router
  .route('/')
  .get(rev.listReviews)
  .post(rev.createReview);

router.delete('/:id', rev.deleteReview);

module.exports = router;
