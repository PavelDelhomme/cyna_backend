const { DataTypes, Sequelize } = require("sequelize");
const config = require('../config/database');
const sequelize = new Sequelize(config);

const productSchema = {
    id: Number,
    nom: String,
    description: String,
    prix: Number,
    stock: Number,
    promotion: String
};