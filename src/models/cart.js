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
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'userId' });
    Cart.hasMany(models.Order);
  };

  return Cart;
};
