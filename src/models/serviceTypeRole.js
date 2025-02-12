const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Modèle OrderItem
const ServiceType = sequelize.define("ServiceType", {
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
const ServiceTypeRole = sequelize.define(
  "ServiceTypeRole",
  {
    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceType,
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
ServiceType.belongsToMany(Role, {
  through: ServiceTypeRole,
  foreignKey: "service_type_id",
  as: "roles",
});

Role.belongsToMany(ServiceType, {
  through: ServiceTypeRole,
  foreignKey: "role_id",
  as: "serviceTypes",
});

module.exports = { ServiceType, Role, ServiceTypeRole };
