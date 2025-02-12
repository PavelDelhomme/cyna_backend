const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Modèle OrderItem
const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle Product
const PromoCode = sequelize.define("PromoCode", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire OrderItemProduct
const RolePromoCode = sequelize.define(
  "RolePromoCode",
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    promo_code_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PromoCode,
        key: "id",
      },
    },
  },
  { timestamps: false } // Désactive les colonnes createdAt et updatedAt
);

// Définition des associations Many-to-Many
Role.belongsToMany(PromoCode, {
  through: RolePromoCode,
  foreignKey: "role_id",
  as: "promoCodes",
});

PromoCode.belongsToMany(Role, {
  through: RolePromoCode,
  foreignKey: "promo_code_id",
  as: "roles",
});

module.exports = { Role, PromoCode, RolePromoCode };
