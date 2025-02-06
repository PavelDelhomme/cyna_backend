const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const ProductCategory = sequelize.define('ProductCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: DataTypes.STRING(50),
    Description: DataTypes.STRING(50),
  });