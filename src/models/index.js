const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

console.log('Configuration Sequelize:', {
    database: config.database,
    username: config.username,
    host: config.host,
    port: config.port,
    dialect: config.dialect
});

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
    },
    retry: {
      max: 5,
      match: [/ECONNREFUSED/],
      timeout: 30000
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
    // Passe DataTypes ici :
    const model = require(fullPath)(sequelize, Sequelize.DataTypes);
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
