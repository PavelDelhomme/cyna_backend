const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    address1: DataTypes.STRING(200),
    city: DataTypes.STRING(100),
    postalCode: DataTypes.STRING(50),
    region: DataTypes.STRING(100),
    country: DataTypes.STRING(50),
    type: DataTypes.STRING(50),
  });

  Address.associate = (models) => {
    Address.belongsToMany(models.UserProfile, {
      through: "AddressUserProfile",
      foreignKey: "address_id"
    });
  };

  return Address;
};
