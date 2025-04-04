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
  }, {
    underscored: true,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  User.associate = (models) => {
    /* Pour l'alternative pour spécification de nom unique pour la contrainte de clé étrangère si nécessaire si dans index.js de models les étapes n'ont pas fonctionné */
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      //targetKey: 'id',
      // constraints: true,
      // onDelete: 'SET NULL',
      // onUpdate: 'CASCADE',
      foreignKeyConstraint: { name: 'fk_user_role' }
    });

    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Ticket, {
      foreignKey: 'user_id',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Chatbot, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
