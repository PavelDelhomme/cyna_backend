const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creationDate: DataTypes.DATE,
    totalPrice: DataTypes.DOUBLE,
    status: DataTypes.STRING(50),
    userId: DataTypes.INTEGER,
    cartId: DataTypes.INTEGER
  });