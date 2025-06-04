const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductCategoryRole = sequelize.define(
    "ProductCategoryRole",
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_categories',
          key: "id",
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: "id",
        },
      },
    },
    { 
      tableName: 'asso_categoryproducts_roles',
      timestamps: false
    }
  );

  return ProductCategoryRole;
};
