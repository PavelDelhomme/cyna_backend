const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    password: DataTypes.STRING(50),
    phone: DataTypes.STRING(20)
  });

  User.associate = (models) => {
    User.belongsTo(models.Role);
    User.hasMany(models.Order);
    User.hasMany(models.Ticket);
    User.hasOne(models.Chatbot);
  };

  return User;
};
