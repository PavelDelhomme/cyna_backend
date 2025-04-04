const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
    // Suppression de userId car Sequelize ajoute automatiquement UserId cela créer des problème du duplicata de champs dans la bdd
  }, {
    underscored: true,
    tableName: 'user_profiles',
    timestamps: false, // Pour ne pas avoir de created_at/updated_at
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      foreignKeyConstraint: { name: 'fk_user_profile_user' }
    });

    UserProfile.belongsToMany(models.Address, {
      through: "address_user_profiles",
      foreignKey: "user_profile_id",
      otherKey: "address_id",
      as: "addresses"
    });
  };

  return UserProfile;
};
