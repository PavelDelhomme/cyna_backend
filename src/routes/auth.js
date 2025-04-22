const express = require('express');
const router = express.Router();
const { signup, login, refreshToken } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

router.get('/dev-admin', async (req, res) => {
    const { User, Role } = require('../models');
  
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
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur création admin" });
    }
  });
  

module.exports = router;
