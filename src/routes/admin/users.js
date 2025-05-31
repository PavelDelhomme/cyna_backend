const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const users   = require('../../controllers/userController');

router.use(auth(['admin']));

router.get('/', auth(['admin']), users.getAllUsers);
router.post('/', auth(['admin', 'user']), users.createUser);
router.get('/:id', auth(['user', 'admin']), users.getUserById);

router.patch('/:id', auth(['user','admin']), users.updateUser);
router.delete('/:id', auth(['user', 'admin']), users.deleteUser);
// Pour assigner un rôle à un utilisateur
// POST /api/admin/users/:userId/roles/:roleId
router.post(
  '/:userId/roles/:roleId',
  auth(['admin']),
  users.assignRoleToUser
);

module.exports = router;
