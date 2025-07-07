const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, UserProfile } = require("../models");

const generateTokens = (user, roleName = null) => {
    const token = jwt.sign(
      { 
        userId: user.id,
        role: roleName || (user.role?.name ?? 'user'),
    },
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

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérification des champs requis
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        // Vérifier si l'email existe déjà
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // Vérifier/Créer le rôle 'user' si absent
        const [role] = await Role.findOrCreate({
            where: { name: 'user' },
            defaults: { name: 'user' }
        });

        const user = await User.create({ name, email, password, role_id: role.id });

        // Création de UserProfile
        const [profile] = await UserProfile.findOrCreate({ where: { user_id: user.id } });

        const { token, refreshToken } = generateTokens(user, role.name);

        res.status(201).json({ 
          token, 
          refreshToken, 
          userId: user.id, 
          profile: {
            id: profile.id,
            user_id: profile.user_id,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
          },
          role: role.name, 
        });
    } catch (error) {
        // Gestion des erreurs Sequelize (validation, unicité, etc.)
        if (error.name === 'SequelizeUniqueConstraintError') {
            if (error.errors && error.errors[0].path === 'email') {
                return res.status(400).json({ error: "Cet email est déjà utilisé" });
            }
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: error.errors[0].message || "Erreur de validation" });
        }
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        // 🔐 Création du profil si inexistant
        const [profile] = await UserProfile.findOrCreate({ where: { user_id: user.id } });

        const { token, refreshToken } = generateTokens(user, user.role?.name);

        res.json({ 
            token,
            refreshToken,
            userId: user.id,
            role: user.role?.name,
            profile: {
                id: profile.id,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            }
        });
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: err.message });
    }
};

const refreshToken = async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findByPk(decoded.userId, {
        include: [{ model: Role, as: 'role' }]
      });      
      if (!user) return res.status(401).json({ error: "Utilisateur non trouvé" });
  
      const { token, refreshToken } = generateTokens(user);
      res.json({ token, refreshToken });
    } catch (err) {
      res.status(401).json({ error: "Refresh token invalide ou expiré" });
    }
  };


module.exports = {
  signup,
  login,
  refreshToken
};