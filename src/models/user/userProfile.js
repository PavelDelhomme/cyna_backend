const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    tableName: 'user_profiles',
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
      as: 'user',
      foreignKeyConstraint: { name: 'fk_user_profile_user' }
    });

    UserProfile.belongsToMany(models.Address, {
      through: models.AddressUserProfile,
      foreignKey: "user_profile_id",
      otherKey: "address_id",
      as: "address",
      foreignKeyConstraint: { name: 'fk_user_profile_address' }
    });
  };

  return UserProfile;
};
