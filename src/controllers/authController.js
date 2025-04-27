const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, UserProfile } = require("../models");

const generateTokens = (user) => {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '365d' }
    );
  
    return { token, refreshToken };
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier/Créer le rôle 'user' si absent
        const [role] = await Role.findOrCreate({
            where: { name: 'user' },
            defaults: { name: 'user' }
        });

        const user = await User.create({ name, email, password, role_id: role.id });

        // Créatoin de UserProfile
        await UserProfile.create({ user_id: user.id });

        const { token, refreshToken } = generateTokens(user);

        res.status(201).json({ token, userId: user.id, role: role.name });
    } catch (error) {
        console.log(err);
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }, include: [Role] });
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const { token, refreshToken } = generateTokens(user);
        res.json({ 
            token,
            refreshToken,
            userId: user.id,
            role: user.Role.name,
        });
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.userId, { include: [Role] });
      if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });
  
      const { token, refreshToken } = generateTokens(user);
      res.json({ token, refreshToken });
    } catch (err) {
      res.status(401).json({ error: "Refresh token invalide ou expiré" });
    }
  };