const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
    // Suppression de userId car Sequelize ajoute automatiquement UserId cela créer des problème du duplicata de champs dans la bdd
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User);
    UserProfile.belongsToMany(models.Address, {
      through: "AddressUserProfile",
      foreignKey: "user_profile_id",
      as: "addresses"
    });
  };

  return UserProfile;
};
