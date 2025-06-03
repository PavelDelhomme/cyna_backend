const path = require('path');
const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
require('dotenv').config({ path: path.join(__dirname, '..', '..', envFile) });

console.log('Environnement actuel:', process.env.NODE_ENV);
console.log('Configuration DB:', {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

const config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'yourpassword',
        database: process.env.DB_NAME || 'cyna_database',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
            evict: 10000
        },
        logging: console.log
    },     
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'),
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false
    },
    docker: {
        username: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'yourpassword',
        database: process.env.DB_NAME || 'cyna_database',
        host: process.env.DB_HOST || 'db',
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT || '3306'),
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: console.log
    }
};

module.exports = config;
  