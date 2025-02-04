const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
// Importer les autres routes...

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
// Utiliser les autres routes...

// Sync database
sequelize.sync({ force: false }).then(() => {
  const port = process.env.PORT || 3007;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
