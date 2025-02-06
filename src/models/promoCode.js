const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const PromoCode = sequelize.define('PromoCode', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: DataTypes.STRING(50),
    Benefit: DataTypes.STRING(50),
    Status: DataTypes.BOOLEAN,
  });