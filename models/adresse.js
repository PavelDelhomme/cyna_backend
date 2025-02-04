const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);


const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    address1: DataTypes.STRING(200),
    city: DataTypes.STRING(100),
    postalCode: DataTypes.STRING(50),
    region: DataTypes.STRING(100),
    country: DataTypes.STRING(50),
    type: DataTypes.STRING(50)
});
