const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItemService = sequelize.define(
    "OrderItemService",
    {
      // Pas besoin d'utiliser les clés étrangères également 
    },
    { timestamps: false }
  );

  return OrderItemService;
};
