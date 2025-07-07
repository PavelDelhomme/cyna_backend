const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creationdate: {
      type: DataTypes.DATE,
      field: 'creationdate'
    },
    lastupdate: {
      type: DataTypes.DATE,
      field: 'lastupdate'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'carts',
    timestamps: true,
    underscored: true
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { 
      foreignKey: 'userId',
      foreignKeyConstraint: { name: 'fk_cart_user' } 
    });
  };

  return Cart;
};
