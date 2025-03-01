const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChatbotHistory = sequelize.define('ChatbotHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    chat: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  ChatbotHistory.associate = (models) => {
    ChatbotHistory.belongsTo(models.Chatbot);
  };

  return ChatbotHistory;
};
