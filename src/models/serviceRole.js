const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceRole = sequelize.define(
    "ServiceRole",
    {
      // Supprimez l'ID si jointure
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
    { 
      underscored: true,
      timestamps: false,
      primaryKey: [
        'service_id',
        'role_id'
      ]
    }
  );

  return ServiceRole;
};
