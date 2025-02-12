const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const { ServiceRole } = require(".");
const sequelize = new Sequelize(config);

// Modèle OrderItem
const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle Product
const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire OrderItemProduct
const ServiceRole = sequelize.define(
  "ServiceRole",
  {
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Service,
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
Service.belongsToMany(Role, {
  through: ServiceRole,
  foreignKey: "service_id",
  as: "roles",
});

Role.belongsToMany(Service, {
  through: Service,
  foreignKey: "role_id",
  as: "services",
});

module.exports = { Service, Role, ServiceRole };
