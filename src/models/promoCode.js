const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PromoCode extends Model {
    static associate(models) {
      // Association avec les rôles via la table de jointure
      PromoCode.belongsToMany(models.Role, {
        through: models.RolePromoCode,
        foreignKey: 'promo_code_id',
        otherKey: 'role_id',
        as: 'roles'
      });

      // Association avec les produits
      PromoCode.hasMany(models.Product, {
        foreignKey: 'promo_code_id',
        as: 'products'
      });
    }
  }

  PromoCode.init({
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      field: 'discount_type'
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'discount_value'
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'min_order_amount'
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'max_discount_amount'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date'
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'max_uses'
    },
    currentUses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'current_uses'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'PromoCode',
    tableName: 'promo_codes',
    timestamps: true,
    underscored: true
  });

  return PromoCode;
};
