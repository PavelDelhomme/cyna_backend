const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

const express = require('express');
const cors    = require('cors');
const config  = require("./config/database")[process.env.NODE_ENV || 'development'];
const db      = require('./models');
const jwt     = require('jsonwebtoken');
const { where } = require('sequelize');
const multer = require('multer');
const auth = require('./middlewares/authMiddleware'); 
const { execSync } = require('child_process');

console.log('Environnement:', process.env.NODE_ENV);
console.log('Configuration DB:', {
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username
});

const app = express();

// Configurer le dossier d'upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier où stocker les images
  },
  filename: function (req, file, cb) {
    // nom unique pour éviter les collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Rendre le dossier uploads accessibles publiquement
app.use('/uploads', express.static('uploads'));

// 1. CORS : autorise ton front
app.use(cors({
  // Reflecte l'origine de la requête comme valeur d'Access-Control-Allow-Origin
  origin: (origin, callback) => {
    // autorise les requêtes sans origin (Postman, mobile, etc.)
    if (!origin) return callback(null, true);
    // liste blanche
    const whiteList = [
      'http://localhost:3000', // <-- Ajoute ce port pour le front React
      'http://127.0.0.1:3000',
      'http://localhost:3007',
      'http://127.0.0.1:3007',
      'https://cyna.delhomme.ovh',
      'https://www.cyna.delhomme.ovh'
    ];
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,           // si tu veux gérer les cookies/credentials
  methods: ['GET','POST','PATCH','DELETE','PUT','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

console.log(config);

// Middleware global
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// DB
const { User, Role } = db;


// --- Routes User / Public ---
app.use("/api/auth", require('./routes/auth'));  // Auth publique
app.use("/api/addresses", auth(['user', 'admin']), require('./routes/addresses'));  // Ajout du middleware avec les rôles autorisés
app.use("/api/users", require('./routes/users'));
app.use("/api/roles", require('./routes/roles'));
// → point d'entrée unique pour le profil (user/admin)
app.use("/api/profile", require('./routes/profile'));
app.use("/api/promo-codes", require('./routes/promo-codes'));
app.use("/api/chatbots", require('./routes/chatbots'));
app.use("/api/chatbots-histories", require('./routes/chatbot-histories'));
app.use("/api/messages", require('./routes/messages'));
app.use("/api/product-categories", require('./routes/product-categories'));
app.use("/api/products", require('./routes/products'));
app.use("/api/service-types", require('./routes/service-types'));
app.use("/api/services", require('./routes/services'));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/reviews", require('./routes/reviews'));
app.use("/api/payments", require('./routes/payments'));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/carts", require("./routes/carts"));
app.use("/api/tickets", require("./routes/tickets"));
app.use('/api/team', require('./routes/team'));
app.use('/api/carousel', require('./routes/carousel'));
app.use("/api/details", require('./routes/product-details'));
app.use('/api/search', require('./routes/search'));

// public debug
app.use("/api/dev",       require("./routes/devTest"));

// admin debug
app.use("/api/admin/dev", require("./routes/devTest"));

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} introuvable`});
});


// --- Initialisation ---
const initializeApp = async () => {
  let retries = 5;
  while (retries) {
    try {
      await db.sequelize.authenticate({
        retry: {
          max: 10,
          match: [/ECONNREFUSED/],
          timeout: 30000
        }
      });
      console.log("Connexion à la base de données établie avec succès.");
      
      // Vérifier si la base de données est déjà initialisée
      const isInitialized = await db.sequelize.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'cyna_database' AND table_name = 'roles'"
      ).then(([results]) => results[0].count > 0);

      if (!isInitialized || process.env.RESET_DB === 'true') {
        console.log("Initialisation de la base de données...");
        // Désactiver les contraintes de clés étrangères
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Synchronisation des modèles avec la base de données
        await db.sequelize.sync({
          force: true,
          logging: console.log,
          alter: false
        });
        
        // Réactiver les contraintes de clés étrangères
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log("Synchronisation de la base de données terminée");

        // Créer les rôles de base
        await Role.findOrCreate({ where: { name: 'user' }});
        await Role.findOrCreate({ where: { name: 'admin' }});
        await Role.findOrCreate({ where: { name: 'support' }});
        await Role.findOrCreate({ where: { name: 'customer' }});
        await Role.findOrCreate({ where: { name: 'seller' }});
        console.log("✅ Rôles de base (user, admin, support, customer, seller) en place");

        // Créer l'admin par défaut
        const adminUser = await createDevAdminIfNotExists();
        const { UserProfile } = db;
        await UserProfile.findOrCreate({ where: { user_id: adminUser.id } });

        // Initialiser les données de démo si demandé
        if (process.env.INIT_ALL === 'true') {
          try {
            console.log("Lancement du script d'initialisation des données (init-all.js)...");
            require('../scripts/init-all.js');
            console.log("✅ Données de démo insérées !");
          } catch (err) {
            console.error("Erreur lors de l'exécution de init-all.js :", err);
            process.exit(1);
          }
        }
      } else {
        console.log("Base de données déjà initialisée, démarrage normal...");
      }

      // Démarrage du server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Serveur en écoute sur le port http://0.0.0.0:${PORT}`);
      });

      return;

    } catch (err) {
      console.error(`Tentative de connexion échouée (${5-retries+1}/5): `, err);
      retries --;
      if (retries === 0) {
        console.error("Impossible de se connecter à la base de données après plusieurs tentatives");
        process.exit(1);
      }
      // Attendre 10 secondes avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
};



const createDevAdminIfNotExists = async () => {
  const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });

  const [adminUser, created] = await User.findOrCreate({
    where: { email: 'admin@cyna.dev' },
    defaults: {
      name: 'Admin Dev',
      password: 'azerty123',
      role_id: adminRole.id
    }
  });

  console.log(created
    ? "✅ Admin créé automatiquement !"
    : "ℹ️ Admin existant utilisé.");

  // Générer et afficher les nouveaux tokens
  const token = jwt.sign({ userId: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
  const refreshToken = jwt.sign({ userId: adminUser.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' });

  console.log("\n=== ADMIN DEV TOKENS ===");
  console.log("Token :", token);
  console.log("Refresh Token :", refreshToken);
  console.log("========================\n");
  return adminUser;
};

// Démarrer l'application
initializeApp().catch(err => {
  console.error("Erreur critique lors du démarrage :", err);
  process.exit(1);
});