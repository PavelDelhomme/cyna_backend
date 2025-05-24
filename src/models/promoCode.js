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
    tableName: 'promo_codes'
  });

  PromoCode.associate = (models) => {
    PromoCode.belongsToMany(models.Role, {
      through: models.RolePromoCode,
      foreignKey: 'promo_code_id',
      otherKey: 'role_id',
      as: 'roles',
      foreignKeyConstraint: { name: 'fk_promo_code_role' }
    });
  };

  return PromoCode;
};
