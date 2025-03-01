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
    { timestamps: false }
  );

  return AddressUserProfile;
};
