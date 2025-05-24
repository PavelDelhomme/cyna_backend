const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    name: {
      type: DataTypes.ENUM('admin', 'user', 'support'),
      defaultValue: 'user'
    },
  }, {
    tableName: 'roles',
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'role_id',
      foreignKeyConstraint: { name: 'fk_user_role' }
    });
  };

  return Role;
};
