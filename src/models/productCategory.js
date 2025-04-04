const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(50)
  }, {
    underscored: true,
  });

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.Product);
    ProductCategory.belongsToMany(models.Role, {
      through: 'ProductCategoryRole',
      foreignKey: 'category_id',
      as: 'roles'
    });
  };

  return ProductCategory;
};
