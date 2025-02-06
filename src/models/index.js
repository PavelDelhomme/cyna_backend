const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    //dialect: 'mysql',
    dialect: config.dialect,
    port: config.port,
    pool: config.pool
  }
);

// Importer tous les modèles
const User = require('./user');
const Role = require('./role');
const Order = require('./order');
// New Model
const OrderItem = require('./orderItem')
// New Model
const Invoice = require('./invoice');
const Ticket = require('./ticket');
const Chatbot = require('./chatbot');
const ChatbotHistory = require('./chatbotHistory');
const Address = require('./address');
const Cart = require('./cart');
// New Models
const PromoCode = require('./promoCode');
const Service = require('./service');
const ServiceType = require('./serviceType');
const Product = require('./product');
const ProductCategory = require('./productCategory')
const Payment = require('./payment')
const Review = require('./review')
const Stat = require('./stat')

// ASSOCIATION ---->
const OrderItemProduct = require('./orderItemProduct') 
const OrderItemService = require('./orderItemService')
// New Models

// Initialiser les modèles avec sequelize
const models = {
  User: User(sequelize),
  Role: Role(sequelize),
  Order: Order(sequelize),
  //New Models
  OrderItem: OrderItem(sequelize),
  //New Models
  Invoice: Invoice(sequelize),
  Ticket: Ticket(sequelize),
  Chatbot: Chatbot(sequelize),
  ChatbotHistory: ChatbotHistory(sequelize),
  Address: Address(sequelize),
  Cart: Cart(sequelize),
  //New Models
  PromoCode: PromoCode(sequelize),
  Service: Service(sequelize),
  ServiceType: ServiceType(sequelize),
  Product: Product(sequelize),
  ProductCategory: ProductCategory(sequelize),
  Payment: Payment(sequelize),
  Review: Review(sequelize),
  Stat: Stat(sequelize),

  // ASSOCIATION ---->
  OrderItemProduct: OrderItemProduct(sequelize),
  OrderItemService: OrderItemService(sequelize),
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
