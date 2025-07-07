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
    promotion: DataTypes.STRING(255),
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id'
    },
    promo_code_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'promo_code_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['ProductCategoryId']
      }
    }
  });

  Product.associate = (models) => {
    Product.belongsTo(models.ProductCategory, {
      foreignKey: {
        name: 'category_id',
        field: 'category_id'
      },
      targetKey: 'id',
      as: 'category',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    Product.belongsTo(models.PromoCode, {
      foreignKey: {
        name: 'promo_code_id',
        field: 'promo_code_id'
      },
      targetKey: 'id',
      as: 'promoCode',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    Product.belongsToMany(models.OrderItem, { 
      through: models.OrderItemProduct,
      foreignKey: 'product_id',
      otherKey: 'order_item_id',
      as: 'orderItems',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Product;
};
