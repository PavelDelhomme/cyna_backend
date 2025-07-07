const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: 'user',
      validate: {
        len: { args: [1, 255], msg: "Le nom doit faire entre 1 et 255 caractères"}
      }
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
