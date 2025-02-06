const { DataTypes, Sequelize } = require("sequelize");
const config = require("../config/database");
const sequelize = new Sequelize(config);

// Modèle Address
const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle UserProfile
const UserProfile = sequelize.define("UserProfile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});

// Modèle de table intermédiaire AddressUserProfile
const AddressUserProfile = sequelize.define(
  "AddressUserProfile",
  {
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Adresse,
        key: "id",
      },
    },
    user_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserProfile,
        key: "id",
      },
    },
  },
  { timestamps: false } // Désactive les colonnes createdAt et updatedAt
);

// Définition des associations Many-to-Many
Address.belongsToMany(UserProfile, {
  through: AddressUserProfile,
  foreignKey: "address_id",
  as: "userProfiles",
});

UserProfile.belongsToMany(Address, {
  through: AddressUserProfile,
  foreignKey: "user_profile_id",
  as: "addresses",
});

module.exports = { Address, UserProfile, AddressUserProfile };
