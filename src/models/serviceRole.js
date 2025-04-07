const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceRole = sequelize.define(
    "ServiceRole",
    {
      service_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
          model: 'services',
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
      underscored: true,
      timestamps: false,
      tableName: 'service_roles',
      primaryKey: [
        'service_id',
        'role_id'
      ]
    }
  );

  return ServiceRole;
};
