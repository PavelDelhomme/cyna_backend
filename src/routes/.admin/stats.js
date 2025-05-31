const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const stat    = require('../../controllers/statController');

router.use(auth(['admin']));

router
  .route('/')
  .get(stat.listStats)
  .post(stat.createStat);

module.exports = router;
