const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItemService = sequelize.define(
    "OrderItemService",
    {
      // Pas besoin d'utiliser les clés étrangères également 
    },
    { 
      timestamps: false,
      underscored: true,
      tableName: 'order_item_services'
    }
  );

  OrderItemService.associate = (models) => {
    OrderItemService.belongsTo(models.Service, {
      foreignKey: 'service_id',
      otherKey: 'order_item_id'
    });
    OrderItemService.belongsTo(models.OrderItem, {
      foreignKey: 'order_item_id',
      otherKey: 'service_id'
    });
  };

  return OrderItemService;
};
