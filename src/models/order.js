const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
    Order.belongsTo(models.Cart, { foreignKey: 'cartId' });
  };

  return Order;
};
