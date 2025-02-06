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

// Modèle Service
const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire OrderItemService
const OrderItemService = sequelize.define(
  "OrderItemService",
  {
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderItem,
        key: "id",
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Service,
        key: "id",
      },
    },
  },
  { timestamps: false } // Désactive les colonnes createdAt et updatedAt
);

// Définition des associations Many-to-Many
OrderItem.belongsToMany(Service, {
  through: OrderItemService,
  foreignKey: "order_item_id",
  as: "services",
});

Service.belongsToMany(OrderItem, {
  through: OrderItemService,
  foreignKey: "service_id",
  as: "orderItems",
});

module.exports = { OrderItem, Service, OrderItemService };
