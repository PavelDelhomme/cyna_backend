const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Modèle OrderItem
const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle Product
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire OrderItemProduct
const OrderItemProduct = sequelize.define(
  "OrderItemProduct",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderItem,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  { timestamps: false } // Désactive les colonnes createdAt et updatedAt
);

// Définition des associations Many-to-Many
OrderItem.belongsToMany(Product, {
  through: OrderItemProduct,
  foreignKey: "order_item_id",
  as: "products",
});

Product.belongsToMany(OrderItem, {
  through: OrderItemProduct,
  foreignKey: "product_id",
  as: "orderItems",
});

module.exports = { OrderItem, Product, OrderItemProduct };
