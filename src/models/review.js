const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'reviewdate'
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'reviews',
    timestamps: false,
    validate: {
      eitherProductOrService() {
        if ((this.product_id && this.service_id) || (!this.product_id && !this.service_id)) {
          throw new Error('Un avis doit être associé soit à un produit soit à un service, mais pas les deux.');
        }
      }
    }
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Service, { 
      foreignKey: 'service_id', 
      foreignKeyConstraint: { name: 'fk_review_service' },
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.Product, { 
      foreignKey: 'product_id', 
      foreignKeyConstraint: { name: 'fk_review_product' },
      onDelete: 'CASCADE'
    });
    Review.belongsTo(models.UserProfile, { 
      foreignKey: 'user_profile_id', 
      foreignKeyConstraint: { name: 'fk_review_user_profile' },
      onDelete: 'CASCADE',
      as: 'userProfile'
    });
  };

  return Review;
};
