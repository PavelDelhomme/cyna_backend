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
    /* Pour l'alternative pour spécification de nom unique pour la contrainte de clé étrangère si nécessaire si dans index.js de models les étapes n'ont pas fonctionné */
    // User.belongsTo(models.Role, {
    //   foreignKey: 'RoleId',
    //   constraints: false // Désactive la création automatique de contrainte
    // });

    User.hasMany(models.Order);
    User.hasMany(models.Ticket);
    User.hasOne(models.Chatbot);
  };

  return User;
};
