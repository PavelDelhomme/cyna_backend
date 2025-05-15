const express = require('express');

const config = require("./config/database")[process.env.NODE_ENV || 'development'];
console.log(config);
// DB
const db = require('./models');

// Vérification / création automatique de l'admin
const jwt = require('jsonwebtoken');
const { User, Role } = db;

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const promoCodeRoutes = require('./routes/promo-codes');
const addressRoutes = require('./routes/addresses');
const devRoutes = require('./routes/dev');


const cartRoutes = require('./routes/carts');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const serviceRoutes = require('./routes/services');
const statRoutes = require('./routes/stats');


const path = require('path');
// Servir le petit front-end de test
app.use('/', express.static(path.join(__dirname, "../small_front_test")));

// Middleware
app.use(express.json());

// Routes
app.use("/api/dev", devRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/promo-codes", promoCodeRoutes);
app.use("/api/addresses", addressRoutes);


app.use("/api/carts", cartRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/stats", statRoutes);



app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} introuvable`});
});
//app.use('/api', require('./routes/devTest'));

// Initialisation de Sequelize
// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     dialect: config.dialect,
//     port: config.port,
//     pool: config.pool
//   }
// );

// Initialisation de l'application après connexion à la base de données
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

      await createDevAdminIfNotExists();

      if (process.env.RESET_DB === 'true') {
        await db.Role.findOrCreate({
          where: { name: 'user' },
          default: { nme: 'user' }
        });
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

  if (created) {
    console.log("✅ Admin créé automatiquement !");
  } else {
    console.log("ℹ️ Admin existant utilisé.");
  }

  // Générer et afficher les nouveaux tokens
  const token = jwt.sign(
    { userId: adminUser.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '365d' }
  );

  const refreshToken = jwt.sign(
    { userId: adminUser.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '365d' }
  );

  console.log("\n=== ADMIN DEV TOKENS ===");
  console.log("Token :", token);
  console.log("Refresh Token :", refreshToken);
  console.log("========================\n");
};

// Démarrer l'application
initializeApp().catch(err => {
  console.error("Erreur critique lors du démarrage :", err);
  process.exit(1);
});