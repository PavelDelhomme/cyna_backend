const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require("../models");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier/Créer le rôle 'user' si absent
        const [role] = await Role.findOrCreate({
            where: { name: 'user' },
            defaults: { name: 'user' }
        });

        const user = await User.create({
            name,
            email,
            password,
            role_id: role.id
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ userId: user.id, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await req.db.User.findOne({
            where: { email },
            include: [req.db.Role]
        });

        if (!user || !user.validPassword(password)) {
            throw new Error('Identifiants invalides');
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ userId: user.id, token, role: user.Role.name });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(decoded.userId);

        const newToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ error: "Refresh token invalide"});
    }
};

const generateTokens = (user) => {
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );
  
    return { token, refreshToken };
  };