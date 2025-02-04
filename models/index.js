const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

// Importer tous les modèles
const User = require('./user');
const Role = require('./role');
const Order = require('./order');
const Invoice = require('./invoice');
const Ticket = require('./ticket');
const Chatbot = require('./chatbot');
const ChatbotHistory = require('./chatbotHistory');
const Address = require('./address');

// Initialiser les modèles avec sequelize
const models = {
  User: User(sequelize),
  Role: Role(sequelize),
  Order: Order(sequelize),
  Invoice: Invoice(sequelize),
  Ticket: Ticket(sequelize),
  Chatbot: Chatbot(sequelize),
  ChatbotHistory: ChatbotHistory(sequelize),
  Address: Address(sequelize)
};

// Définir les associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Exporter les modèles et sequelize
module.exports = {
  ...models,
  sequelize
};
