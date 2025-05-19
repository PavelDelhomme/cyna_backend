const express = require('express');
const router  = express.Router();
const auth    = require('../../middlewares/authMiddleware');
const users   = require('../../controllers/userController');

router.use(auth(['admin']));

router.get('/', auth(['admin']), users.getAllUsers);

router.get('/:id', auth(['user', 'admin']), users.getUserById);

router.patch('/:id', auth(['user','admin']), users.updateUser);
router.delete('/:id', auth(['user', 'admin']), users.deleteUser);
// Pour assigner un rôle à un utilisateur
router.post('/:userId/roles/:roleId', users.assignRoleToUser);

module.exports = router;
