const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { signup, login, refreshToken } = require('../controllers/authController');
const { User, Role } = require('../models');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

router.get('/dev-admin', async (req, res) => { 
    try {
      const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
  
      const [user] = await User.findOrCreate({
        where: { email: 'admin@cyna.dev' },
        defaults: {
          name: 'Admin Dev',
          password: 'azerty123',
          role_id: adminRole.id
        }
      });

      // Création profil pour l'admin pour la suite des test
      await UserProfile.findOrCreate({ where: { user_id: user.id } });
  
      // 🔐 Sécurise le rôle même si le user existe déjà
      if (!user.role_id || user.role_id !== adminRole.id) {
        user.role_id = adminRole.id;
        await user.save();
        await user.reload({ include: [{ model: Role, as: 'role' }] });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '365d' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '365d' }
      );

      res.json({ token, refreshToken, userId: user.id });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur création admin" });
    }
  });
  

module.exports = router;
