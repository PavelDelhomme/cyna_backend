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
  });

  ServiceType.associate = (models) => {
    ServiceType.hasMany(models.Service);
    ServiceType.belongsToMany(models.Role, {
      through: 'ServiceTypeRole',
      foreignKey: 'service_type_id',
      as: 'roles'
    });
  };

  return ServiceType;
};
