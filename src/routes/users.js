const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Pour récupérer tous les utilisateurs
router.get('/', authMiddleware(['admin']), userController.getAllUsers);

// Pour récupérer le profil de n'importe quel utilisateur (admin ou soi-même)
router.get('/:id', authMiddleware(['user', 'admin']), userController.getUserById);

// Modifier / supprimer son propre profil
router.patch('/:id', authMiddleware(['user', 'admin']), userController.updateUser);
router.delete('/:id', authMiddleware(['user', 'admin']), userController.deleteUser);

module.exports = router;
