
  const { DataTypes, Sequelize } = require("sequelize");
  const config = require('../config/database');
  const sequelize = new Sequelize(config);
  
  const Stat = sequelize.define('Stat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userProfileId: DataTypes.INTEGER,
  });