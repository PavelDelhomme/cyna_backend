const { DataTypes, ForeignKeyConstraintError } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      ForeignKeyConstraint: { name: 'fk_order_user' }
    });
    Order.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      foreignKeyConstraint: { name: 'fk_order_cart' }
    });
  };

  return Order;
};
// module.exports = (sequelize) => {
//   const Order = sequelize.define('Order', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     creationDate: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW
//     },
//     totalPrice: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.STRING(50),
//       allowNull: false
//     }
//   });

//   Order.associate = (models) => {
//     Order.belongsTo(models.User, { foreignKey: 'userId' });
//     Order.belongsTo(models.Cart, { foreignKey: 'cartId' });
//   };

//   return Order;
// };
