const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceTypeRole = sequelize.define(
    "ServiceTypeRole",
    {
      service_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ServiceTypes',
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: "id",
        },
      },
    },
    { timestamps: false }
  );

  return ServiceTypeRole;
};
