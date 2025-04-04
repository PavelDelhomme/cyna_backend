const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: DataTypes.STRING(50),
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    method: DataTypes.STRING(50)
  }, {
    underscored: true
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { 
      foreignKey: 'order_id'
    });
    Payment.hasMany(models.Invoice, {
      foreignKey: 'payment_id'
    });
  };

  return Payment;
};
