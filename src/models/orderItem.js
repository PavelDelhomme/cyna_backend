const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Quantity: DataTypes.INTEGER,
    Price: DataTypes.DOUBLE,
    orderId: DataTypes.INTEGER,
  });