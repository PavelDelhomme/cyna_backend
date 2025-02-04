const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);


const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    amount: DataTypes.DOUBLE,
    phone: DataTypes.STRING(20),
    creationDate: DataTypes.DATE,
    method: DataTypes.STRING(50),
    quantity: DataTypes.STRING(50),
    userId: DataTypes.INTEGER,
    paymentId: DataTypes.INTEGER
  });
  