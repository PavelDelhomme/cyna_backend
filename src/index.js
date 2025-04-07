const express = require('express');
const { Sequelize } = require('sequelize');
const config = require("./config/database")[process.env.NODE_ENV || 'development'];

// DB
const db = require('./models');

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/users");
const roleRoutes = require('./routes/roles');
const promoCodeRoutes = require('./routes/promo-codes');
const addressRoutes = require('./routes/addresses');

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/promo-codes", promoCodeRoutes);
app.use("/api/addresses", addressRoutes);

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


      if (process.env.RESET_DB === 'true') {
        await db.Role.findOrCreate({
          where: { name: 'user' },
          default: { nme: 'user' }
        });
      }

      // Démarrage du server
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Serveur en écoute sur le port http://localhost:${PORT}`);
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


// Démarrer l'application
initializeApp().catch(err => {
  console.error("Erreur critique lors du démarrage :", err);
  process.exit(1);
});