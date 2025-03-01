const { DataTypes } = require('sequelize');

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
  });

  PromoCode.associate = (models) => {
    PromoCode.belongsToMany(models.Role, {
      through: 'RolePromoCode',
      foreignKey: 'promo_code_id',
      as: 'roles'
    });
  };

  return PromoCode;
};
