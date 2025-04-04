const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Commande = sequelize.define('Commande', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dateCommande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    montantTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    underscored: true,
    tableName: 'commandes'
  });

  Commande.associate = (models) => {
    Commande.belongsTo(models.User, { 
      foreignKey: 'userId',
      foreignKeyConstraint: { name: 'fk_commande_user' } 
    });
  };

  return Commande;
};
