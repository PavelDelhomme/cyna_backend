const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject: DataTypes.STRING(50),
  description: DataTypes.STRING(50),
  status: DataTypes.STRING(50),
  creationDate: DataTypes.DATE,
  updateDate: DataTypes.DATE,
  userId: DataTypes.INTEGER
});
