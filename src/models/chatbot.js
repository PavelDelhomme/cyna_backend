const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const Chatbot = sequelize.define('Chatbot', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    escalated: DataTypes.BOOLEAN,
    prompts: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      unique: true
    }
  });