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
    method: DataTypes.STRING(50),
    type: DataTypes.STRING(50),
    last4: DataTypes.STRING(4),
    expiry: DataTypes.STRING(7),
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'isDefault'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "payments",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { 
      foreignKey: 'order_id'
    });
    Payment.hasMany(models.Invoice, {
      foreignKey: 'payment_id'
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return Payment;
};
