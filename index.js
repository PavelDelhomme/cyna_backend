const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const User = require('./models/User');

const app = express();

app.use(bodyParser.json());

app.use('/api/utilisateurs', userRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée.');
  })
  .catch((err) => {
    console.error("Erreur lors de la synchronisation de la base de données : ", err);
  });

// Lancement serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en cours d'éxecution sur http://localhost:${port}`);
});
