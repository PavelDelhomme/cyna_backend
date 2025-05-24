const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceTypeRole = sequelize.define(
    "ServiceTypeRole",
    {
      service_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'service_types',
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: "id",
        },
      },
    },
    { 
      tableName: 'service_type_roles'
    }
  );

  return ServiceTypeRole;
};
