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
    quantity: DataTypes.STRING(50),
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'invoices'
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.User, {
      foreignKey: {
        name: 'fk_invoice_user',
        allowNull: true
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    Invoice.belongsTo(models.Payment, {
      foreignKey: {
        name: 'fk_invoice_payment',
        allowNull: true
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };
  return Invoice;
};