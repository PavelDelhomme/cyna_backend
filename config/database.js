module.exports = {
    database: 'cyna_db',
    username: 'root', // votre username
    password: '', // votre password
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  