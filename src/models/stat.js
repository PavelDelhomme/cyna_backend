const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Stat = sequelize.define('Stat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    underscored: true,
    tableName: 'stats'
  });

  Stat.associate = (models) => {
    Stat.belongsTo(models.UserProfile, { 
      foreignKey: 'user_profile_id',
      foreignKeyConstraint: { name: 'fk_stat_user_profile' } 
    });
  };

  return Stat;
};
