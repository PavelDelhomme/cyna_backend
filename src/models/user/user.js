const { DataTypes } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const hash = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hash);
      }
    },
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
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      targetKey: 'id',
      as: 'role',
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
    User.hasOne(models.UserProfile, {
      foreignKey: 'user_id',
      foreignKeyConstraint: { name: 'fk_user_profile_user' }
    });
    
    User.hasOne(models.Chatbot, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
