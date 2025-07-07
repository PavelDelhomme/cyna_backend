const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AddressUserProfile = sequelize.define('AddressUserProfile', {
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'asso_addresses_user_profiles',
    timestamps: true,
    underscored: true,
    primaryKey: true,
    uniqueKeys: {
      address_user_profile_unique: {
        fields: ['address_id', 'user_profile_id']
      }
    }
  });

  AddressUserProfile.associate = (models) => {
    AddressUserProfile.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'address'
    });
    AddressUserProfile.belongsTo(models.UserProfile, {
      foreignKey: 'user_profile_id',
      as: 'userProfile'
    });
  };

  return AddressUserProfile;
}; 