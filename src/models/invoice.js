const { DataTypes, ForeignKeyConstraintError } = require('sequelize');

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
    method: DataTypes.STRING(50),
    quantity: DataTypes.STRING(50)
  }, {
    tableName: 'invoices'
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.User, {
      foreignKey: 'user_id',
      foreignKeyConstraint: { name: 'fk_invoice_user' }
    });
    Invoice.belongsTo(models.Payment, {
      foreignKey: 'payment_id',
      foreignKeyConstraint: { name: 'fk_invoice_payment' }
    });
  };

  return Invoice;
};
