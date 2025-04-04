const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    underscored: true,
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE'
      // foreignKeyConstraint: { name: 'fk_order_item_order' }
    });

    OrderItem.belongsToMany(models.Product, {
      through: models.OrderItemProduct,
      foreignKey: 'order_item_id',
      otherKey: 'product_id',
      as: 'products'
    });

    OrderItem.belongsToMany(models.Service, {
      through: models.OrderItemService,
      foreignKey: 'order_item_id',
      otherKey: 'service_id',
      as: 'services'
    });
  };

  return OrderItem;
};
