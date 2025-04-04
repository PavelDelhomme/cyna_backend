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
  }, {
    underscored: true,
    tableName: 'reviews'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Service, { foreignKey: 'service_id', foreignKeyConstraint: { name: 'fk_review_service' } });
    Review.belongsTo(models.Product, { foreignKey: 'product_id', foreignKeyConstraint: { name: 'fk_review_product' } });
    Review.belongsTo(models.UserProfile, { foreignKey: 'user_profile_id', foreignKeyConstraint: { name: 'fk_review_user_profile' }});
  };

  return Review;
};
