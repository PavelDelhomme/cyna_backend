const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chatbot = sequelize.define('Chatbot', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    escalated: DataTypes.BOOLEAN,
    prompts: DataTypes.TEXT,
    // Suppression du champs userId car Sequelize l'ajoute automatiquement
  });

  Chatbot.associate = (models) => {
    Chatbot.belongsTo(models.User);
    Chatbot.hasMany(models.ChatbotHistory);
  };

  return Chatbot;
};
