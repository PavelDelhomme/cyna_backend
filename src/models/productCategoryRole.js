const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductCategoryRole = sequelize.define(
    "ProductCategoryRole",
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductCategories',
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
      timestamps: false,
      underscored: true,
      tableName: 'product_category_roles'
    }
  );

  return ProductCategoryRole;
};
