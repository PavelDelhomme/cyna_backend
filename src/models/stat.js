const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Stat = sequelize.define('Stat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });

  Stat.associate = (models) => {
    Stat.belongsTo(models.UserProfile, { foreignKey: 'userProfileId' });
  };

  return Stat;
};
