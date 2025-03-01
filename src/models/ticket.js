const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subject: DataTypes.STRING(50),
    description: DataTypes.STRING(50),
    status: DataTypes.STRING(50),
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updateDate: DataTypes.DATE
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Ticket;
};
