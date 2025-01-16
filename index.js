const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');

const app = express();

app.use(bodyParser.json());

// Routes pour les utilisateurs
app.use('/api/utilisateurs', userRoutes);

// Lancement du serveur
const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
