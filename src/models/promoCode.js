const { DataTypes, ForeignKeyConstraintError } = require('sequelize');

module.exports = (sequelize) => {
  const PromoCode = sequelize.define('PromoCode', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    benefit: DataTypes.STRING(50),
    status: DataTypes.BOOLEAN
  }, {
    underscored: true,
    tableName: 'product_category_roles'
  });

  PromoCode.associate = (models) => {
    PromoCode.belongsToMany(models.Role, {
      tableName: 'product_category_roles',
      foreignKey: 'promo_code_id',
      otherKey: 'role_id',
      as: 'roles',
      foreignKeyConstraint: { name: 'fk_promo_code_role' }
    });
  };

  return PromoCode;
};
