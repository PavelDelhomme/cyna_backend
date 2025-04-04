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
  }, {
    underscored: true,
    tableName: 'addresses'
  });

  Address.associate = (models) => {
    Address.belongsToMany(models.UserProfile, {
      //through: 'address_user_profiles',
      through: models.AddressUserProfile,
      foreignKey: "address_id",
      otherKey: 'user_profile_id',
      as: 'user_profiles',
      foreignKeyConstraint: { name: 'fk_address_user_profile' }
    });
  };

  return Address;
};
