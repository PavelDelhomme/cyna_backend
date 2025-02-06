const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: DataTypes.STRING(50),
    Description: DataTypes.STRING(255),
    Status: DataTypes.BOOLEAN,
    Price: DataTypes.DOUBLE,
    Subscription: DataTypes.BOOLEAN,
    SubscriptionType: DataTypes.STRING(50),
    UserCount: DataTypes.INTEGER,
    Promotion: DataTypes.STRING(255),
    serviceTypeId: DataTypes.INTEGER,
});