const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceRole = sequelize.define(
    "ServiceRole",
    {
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
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

  return ServiceRole;
};
