const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const roles   = require('../../controllers/roleController');

router.use(auth(['admin']));

router
  .route('/')
  .get(roles.getAllRoles)
  .post(roles.createRole);

router.delete('/:id', roles.deleteRole);

module.exports = router;
