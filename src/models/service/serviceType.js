const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServiceType = sequelize.define('ServiceType', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(255)
  }, {
    underscored: true,
    tableName: 'service_types'
  });

  ServiceType.associate = (models) => {
    ServiceType.hasMany(models.Service, {
      foreignKey: 'service_type_id',
      foreignKeyConstraint: { name: 'fk_service_service_type' }
    });
    ServiceType.belongsToMany(models.Role, {
      through: models.ServiceTypeRole,
      foreignKey: 'service_type_id',
      otherKey: 'role_id',
      as: 'roles',
      foreignKeyConstraint: { name: 'fk_service_type_role' }
    });
  };

  return ServiceType;
};
