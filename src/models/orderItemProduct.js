const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItemProduct = sequelize.define("OrderItemProduct", {}, {
    timestamps: false,
    underscored: true,
    tableName: 'order_item_products'
  });

  OrderItemProduct.associate = (models) => {
    OrderItemProduct.belongsTo(models.Product, {
      foreignKey: 'product_id',
      otherKey: 'order_item_id'
    });
    OrderItemProduct.belongsTo(models.OrderItem, {
      foreignKey: 'order_item_id',
      otherKey: 'product_id'
    });
  };

  return OrderItemProduct;
};

