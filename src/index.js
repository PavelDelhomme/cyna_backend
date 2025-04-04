const express = require('express');
const { Sequelize } = require('sequelize');
const config = require("./config/database")[process.env.NODE_ENV || 'development'];

// Routes
const userRoutes = require("./routes/users");
// const serviceRoutes = require('./routes/services');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');

// DB
const db = require('./models');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
// Autres routes
// app.use("/api/services", serviceRoutes);
// app.use("/api/products", productRoutes);
// app.user("/api/orders", orderRoutes);

// Initialisation de Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    pool: config.pool
  }
);

// Initialisation de l'application après connexion à la base de données
const initializeApp = async () => {
  let retries = 5;
  while (retries) {
    try {
      await db.sequelize.authenticate();
      console.log("Connexion à la base de données établie avec succès.");
      
      // Utilisation d'une variable d'environnement pour contrôler la réinitialisation de la base de données
      const resetDatabase = process.env.RESET_DB === 'true';
      // Synchronisation des modèles avec la base de données (force : false pour ne pas supprimer les tables existantes | true pour laisser sequelize supprimer les tables existantes et les recréer)
      //await db.sequelize.sync({ force: resetDatabase, logging: console.log });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await db.sequelize.sync({
        force: true,
        loggging: console.log,
        hooks: true,
        alter: false,
        // Ajout de l'option pour MySQL
        query: { raw: true },
        // Forcer l'ordre de suppression
        drop: {
          cascade: true,
          order: [
            'addresses', 'address_user_profiles', 'carts', '', 'commandes', '', '', 'order_item_products', 'order_item_services', '', '', '', '', 'product_category_roles', 'product_category_roles', 'reviews', '', '', '', ''
          ]
        }
      });

      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      if (resetDatabase) {
        console.log("Base de données réinitialisée et les modèles synchronisés.");
      } else {
        console.log("Modèles synchronisés avec la base de données existante.");
      }
      /* Alternativement si on ne souhaite pas supprimer toutes les données existantes il faut modifier le modèle User pour spécifier un nom unique pour la contrainte de clé étrangère (Foreign Key (FK)) */
      process.exit(1)
    } catch (err) {
      console.error(`Tentative de connexion échouée (${5-retries+1}/5): `, err);
      retries -= 1;
      if (retries === 0) {
        console.error("Impossible de se connecter à la base de données après plusieurs tentatives");
        process.exit(1);
      }
      // Attendre 5 secondes avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};


initializeApp();