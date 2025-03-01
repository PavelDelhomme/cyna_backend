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
  });

  Product.associate = (models) => {
    Product.belongsTo(models.ProductCategory, { foreignKey: 'categoryId' });
    Product.belongsToMany(models.OrderItem, { 
      through: 'OrderItemProduct',
      foreignKey: 'product_id',
      as: 'orderItems'
    });
  };

  return Product;
};
