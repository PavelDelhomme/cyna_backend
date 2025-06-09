const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Pour récupérer tous les utilisateurs
router.get('/', authMiddleware(['admin']), userController.getAllUsers);

// Créer un nouvel utilisateur
router.post('/', authMiddleware(['admin', 'user']), userController.createUser);

router.post('/:userId/roles/:roleId',
  authMiddleware(['admin']),
  userController.assignRoleToUser
);

// Compte d'utilisateurs (doit être AVANT /:id)
router.get('/count', authMiddleware(['admin']), userController.countUsers);

// Pour récupérer le profil de n'importe quel utilisateur (admin ou soi-même)
router.get('/:id', authMiddleware(['user', 'admin']), userController.getUserById);

// Modifier / supprimer son propre profil
router.patch('/:id', authMiddleware(['user', 'admin']), userController.updateUser);
router.delete('/:id', authMiddleware(['user', 'admin']), userController.deleteUser);

router.post('/:userId/reset-password', authMiddleware(['admin']), userController.adminResetPassword);

router.get('/profile/:id', authMiddleware(['user', 'admin']), userController.getUserProfile);

module.exports = router;
