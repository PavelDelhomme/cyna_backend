const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});


const OrderItemProduct = sequelize.define(
    "OrderItemProduct",
    {},
    { timestamps: false } // Désactive les colonnes createdAt et updatedAt
  );
  
  OrderItem.belongsToMany(Product, {
    through: OrderItemProduct,
    foreignKey: "order_item_id",
  });
  
  Product.belongsToMany(OrderItem, {
    through: OrderItemProduct,
    foreignKey: "product_id",
  });
  