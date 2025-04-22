const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: DataTypes.STRING(255),
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    promotion: DataTypes.STRING(255)
  }, {
    underscored: true,
  });

  Product.associate = (models) => {
    Product.belongsTo(models.ProductCategory, {
      foreignKey: 'category_id'
    });
    
    Product.belongsToMany(models.OrderItem, { 
      through: models.OrderItemProduct,
      foreignKey: 'product_id',
      otherKey: 'order_item_id',
      as: 'orderItems'
    });
  };

  return Product;
};
