const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Salut, monde !');
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution à l'adresse http://localhost:${port}`);
});
