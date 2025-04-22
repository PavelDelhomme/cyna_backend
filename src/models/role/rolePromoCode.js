const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePromoCode = sequelize.define(
    "RolePromoCode",
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: "id",
        },
      },
      promo_code_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'promo_codes',
          key: "id",
        },
      },
    },
    { 
      timestamps: false,
      underscored: true,
      tableName: 'role_promo_codes'
    }
  );

  return RolePromoCode;
};
