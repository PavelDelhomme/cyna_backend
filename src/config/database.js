require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'yourpassword',
        database: process.env.DB_NAME || 'cyna_database',
        host: process.env.DB_HOST || 'db',
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
    }
  };
  