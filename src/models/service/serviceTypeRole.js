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
      tableName: 'asso_servicetypes_roles',
      timestamps: false
    }
  );

  return ServiceTypeRole;
};
