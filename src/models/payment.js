const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Ammount: DataTypes.DOUBLE,
    status: DataTypes.STRING(50),
    CreationDate: DataTypes.DATE,
    Method: DataTypes.STRING(50),
    orderId: DataTypes.INTEGER,
});