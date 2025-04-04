const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    lastUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    underscored: true,
    tableName: 'carts'
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { 
      foreignKey: 'userId',
      foreignKeyConstraint: { name: 'fk_cart_user' } 
    });
  };

  return Cart;
};
