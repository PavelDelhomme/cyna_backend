const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AddressUserProfile = sequelize.define('AddressUserProfile', {
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'asso_addresses_user_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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