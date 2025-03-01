const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItemProduct = sequelize.define(
    "OrderItemProduct",
    {
      // Pas besoin de définir les clés étrangères ici si utilisation de belongsToMany
    },
    { timestamps: false }
  );

  return OrderItemProduct;
};
