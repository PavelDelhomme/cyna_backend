const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AddressUserProfile = sequelize.define(
    "AddressUserProfile",
    {
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Addresses',
          key: "id",
        },
      },
      user_profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'UserProfiles',
          key: "id",
        },
      },
    },
    { 
      tableName: 'address_user_profiles'
    });

  AddressUserProfile.associate = models => {
    AddressUserProfile.belongsTo(models.Address,      { foreignKey: 'address_id' });
    AddressUserProfile.belongsTo(models.UserProfile, { foreignKey: 'user_profile_id' });
  };

  return AddressUserProfile;
};
