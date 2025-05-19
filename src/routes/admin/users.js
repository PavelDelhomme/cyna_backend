const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const users   = require('../../controllers/userController');

router.use(auth(['admin']));

router
  .route('/')
  .get(users.getAllUsers);

router
  .route('/:id')
  .get(users.getUserById)
  .delete(users.deleteUser);

// Pour assigner un rôle à un utilisateur
router.post('/:userId/roles/:roleId', users.assignRoleToUser);

module.exports = router;
