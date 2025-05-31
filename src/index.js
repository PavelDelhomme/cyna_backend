require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const config  = require("./config/database")[process.env.NODE_ENV || 'development'];
const db      = require('./models');
const jwt     = require('jsonwebtoken');
const { where } = require('sequelize');

const app = express();


// 1. CORS : autorise ton front
app.use(cors({
  // Reflecte l’origine de la requête comme valeur d’Access-Control-Allow-Origin
  origin: (origin, callback) => {
    // autorise les requêtes sans origin (Postman, mobile, etc.)
    if (!origin) return callback(null, true);
    // liste blanche
    const whiteList = [
      'http://localhost:3007',
      'http://127.0.0.1:3007'
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
app.use(express.json());

// Servir le petit front-end de test
app.use('/', express.static(path.join(__dirname, "../small_front_test")));

// DB
const { User, Role } = db;


// --- Routes User / Public ---
app.use("/api/auth", require('./routes/auth'));  // Auth publique
app.use("/api/addresses", require('./routes/addresses'));
app.use("/api/users", require('./routes/users'));
app.use("/api/roles", require('./routes/roles'));
// → point d’entrée unique pour le profil (user/admin)
app.use("/api/profile", require('./routes/profile'));
app.use("/api/promo-codes", require('./routes/promo-codes'));
app.use("/api/chatbots", require('./routes/chatbots'));
app.use("/api/chatbots-histories", require('./routes/chatbot-histories'));
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

// public debug
app.use("/api/dev",       require("./routes/devTest"));

// admin debug
app.use("/api/admin/dev", require("./routes/devTest"));

// --- Routes Admin propres ---
app.use("/api/admin/auth",                require('./routes/admin/auth'));
app.use("/api/admin/orders",              require('./routes/admin/orders'));
app.use("/api/admin/invoices",            require('./routes/admin/invoices'));
app.use("/api/admin/payments",            require('./routes/admin/payments'));
app.use("/api/admin/services",            require('./routes/admin/services'));
app.use("/api/admin/reviews",             require('./routes/admin/reviews'));
app.use("/api/admin/addresses",           require('./routes/admin/addresses'));
app.use("/api/admin/promo-codes",         require('./routes/admin/promo-codes'));
app.use("/api/admin/roles",               require('./routes/admin/roles'));
app.use("/api/admin/users",               require('./routes/admin/users'));
app.use("/api/admin/chatbots",            require('./routes/admin/chatbots'));
app.use("/api/admin/chatbot-histories",   require('./routes/admin/chatbot-histories'));
app.use("/api/admin/product-categories",  require('./routes/admin/product-categories'));
app.use("/api/admin/carts",               require('./routes/admin/carts'));
app.use("/api/admin/products",            require('./routes/admin/products'));
app.use("/api/admin/service-types",       require('./routes/admin/service-types'));
app.use("/api/admin/stats",               require('./routes/admin/stats'));
app.use("/api/admin/tickets",             require('./routes/admin/tickets'));
app.use("/api/admin/profiles",            require('./routes/admin/profiles'));

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
      
      // Utilisation d'une variable d'environnement pour contrôler la réinitialisation de la base de données
      //const resetDatabase = process.env.RESET_DB === 'true';
      // Synchronisation des modèles avec la base de données (force : false pour ne pas supprimer les tables existantes | true pour laisser sequelize supprimer les tables existantes et les recréer)
      //await db.sequelize.sync({ force: resetDatabase, logging: console.log });
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await db.sequelize.sync({
        force: process.env.RESET_DB === 'true',
        logging: console.log,
        //hooks: true,
        alter: false,
        // Ajout de l'option pour MySQL
        //query: { raw: true },
        // Forcer l'ordre de suppression
        drop: {
          cascade: true,
          order: [
            // Tables de jointure d'abord
            'order_item_services', 'order_item_products', 
            'address_user_profiles', 'role_promo_codes',
            
            // Tables enfants ensuite
            'order_items', 'invoices', 'payments',
            'tickets', 'stats', 'reviews',
            
            // Tables parents enfin
            'orders', 'carts', 'products', 'services',
            'promo_codes', 'service_types', 'product_categories',
            'users', 'roles', 'addresses'
          ]
        }
      });

      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      // Execution manuelle des seeder
      // if (process.env.RESET_DB === 'true') {
      //   const roles = await db.Role.findAll();
      //   if (roles.length === 0) {
      //     await db.sequelize.getQueryInterface().bulkInsert('roles', [
      //       { name: 'admin' },
      //       { name: 'user' },
      //       { name: 'support' }
      //     ]);
      //   }
      // }
      
      console.log("Synchronisation de la base de données terminée");

      const adminUser = await createDevAdminIfNotExists();

      if (process.env.RESET_DB === 'true') {
        await db.Role.findOrCreate({
          where: { name: 'user' },
          default: { nme: 'user' }
        });
      }

      await Role.findOrCreate({ where: { name: 'user' }});
      await Role.findOrCreate({ where: { name: 'admin' }});
      await Role.findOrCreate({ where: { name: 'support' }});
      await Role.findOrCreate({ where: { name: 'customer' }});
      await Role.findOrCreate({ where: { name: 'seller' }});

      console.log("✅ Rôles de base (user, admin, support, customer, seller) en place");

      // create Dev admin profile if not exists
      const { UserProfile } = db;
      await UserProfile.findOrCreate({ where: { user_id: adminUser.id } });


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