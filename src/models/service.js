const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(255),
    status: DataTypes.BOOLEAN,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subscription: DataTypes.BOOLEAN,
    subscriptionType: DataTypes.STRING(50),
    userCount: DataTypes.INTEGER,
    promotion: DataTypes.STRING(255)
  }, {
    underscored: true,
  });

  Service.associate = (models) => {
    Service.belongsTo(models.ServiceType, { foreignKey: 'serviceTypeId' });
    Service.belongsToMany(models.Role, {
      through: models.ServiceRole,
      foreignKey: 'service_id',
      otherKey: 'service_role_id',
      as: 'roles'
    });
    Service.belongsToMany(models.OrderItem, {
      through: models.OrderItemService,
      foreignKey: 'service_id',
      otherKey: 'order_item_id',
      as: 'orderItems'
    });
  };

  return Service;
};
