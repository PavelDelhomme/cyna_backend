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
    },
    chatbotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chatbots',
        key: 'id'
      }
    }
  });

  ChatbotHistory.associate = (models) => {
    ChatbotHistory.belongsTo(models.Chatbot, { foreignKey: 'chatbotId' });
  };

  return ChatbotHistory;
};
