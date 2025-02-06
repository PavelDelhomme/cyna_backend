const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Modèle ProductCategory
const ProductCategory = sequelize.define("ProductCategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle Role
const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire OrderItemProduct
const ProductCategoryRole = sequelize.define(
  "ProductCategoryRole",
  {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderItem,
        key: "id",
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  { timestamps: false } // Désactive les colonnes createdAt et updatedAt
);

// Définition des associations Many-to-Many
ProductCategory.belongsToMany(ProductCategory, {
  through: ProductCategoryRole,
  foreignKey: "category_id",
  as: "productCategorys",
});

Role.belongsToMany(Role, {
  through: ProductCategoryRole,
  foreignKey: "role_id",
  as: "Roles",
});

module.exports = { OrderItem, Product, OrderItemProduct };
