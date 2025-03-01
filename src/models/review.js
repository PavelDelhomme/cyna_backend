const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rating: DataTypes.INTEGER,
    description: DataTypes.STRING(50),
    reviewDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Service, { foreignKey: 'serviceId' });
    Review.belongsTo(models.Product, { foreignKey: 'productId' });
    Review.belongsTo(models.UserProfile, { foreignKey: 'userProfileId' });
  };

  return Review;
};
