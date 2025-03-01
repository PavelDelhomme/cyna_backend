const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePromoCode = sequelize.define(
    "RolePromoCode",
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: "id",
        },
      },
      promo_code_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'PromoCodes',
          key: "id",
        },
      },
    },
    { timestamps: false }
  );

  return RolePromoCode;
};
