
  const { DataTypes, Sequelize } = require("sequelize");
  const config = require('../config/database');
  const sequelize = new Sequelize(config);
  
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Rating: DataTypes.INTEGER,
    Description: DataTypes.STRING(50),
    ReviewDate: DataTypes.DATE,
    serviceId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    userProfileId: DataTypes.INTEGER,
  });