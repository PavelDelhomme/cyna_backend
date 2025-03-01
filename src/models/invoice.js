const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    phone: DataTypes.STRING(20),
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    method: DataTypes.STRING(50),
    quantity: DataTypes.STRING(50)
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.User, { foreignKey: 'userId' });
    Invoice.belongsTo(models.Payment, { foreignKey: 'paymentId' });
  };

  return Invoice;
};
