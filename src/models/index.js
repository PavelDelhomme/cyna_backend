const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    pool: config.pool,
    logging: config.logging,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: false
    }
  }
);


const db = {};

// Fonction récursive chargement de tout .js dans tout les sous dossier de models
function loadModels(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return loadModels(fullPath);
    if (file === 'index.js' || !file.endsWith('.js')) return;
    const model = require(fullPath)(sequelize);
    db[model.name] = model;
  });
}

// Lancemet depuis le dossier courant
loadModels(__dirname);

// 2) **UN SEUL** passage pour appliquer tous les `associate()` déclarés
Object.values(db)
  .filter(m => typeof m.associate === 'function')
  .forEach(m => m.associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
