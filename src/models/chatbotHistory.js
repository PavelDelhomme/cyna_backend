const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const ChatbotHistory = sequelize.define('ChatbotHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    chat: DataTypes.TEXT,
    chatbotId: DataTypes.INTEGER
  });
  