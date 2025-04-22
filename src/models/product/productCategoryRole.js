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
      timestamps: false,
      underscored: true,
      tableName: 'product_category_roles'
    }
  );

  return ProductCategoryRole;
};
