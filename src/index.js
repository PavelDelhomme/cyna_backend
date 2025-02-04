const express = require('express');
const { Sequelize } = require('sequelize');
const config = require("./config/database")[process.env.NODE_ENV || 'development'];
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

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

// Test de la connexion
sequelize.authenticate()
.then(() => {
  console.log("Connexion à la base de données établie avec succès.");
  // Synchronisation des modèles avec la base de données
  return sequelize.sync({ force: false });
})
.then(() => {
  console.log("Modèles synchronisés avec la base de données");
})
.catch(err => {
  console.error("Impossible de se connecter à la base de données : ", err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Le serveur à démarré sur le port ${port} (en réalité c'est sur le port 3007)`);
});