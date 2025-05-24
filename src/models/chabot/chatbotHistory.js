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
    // chatbotId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Chatbots',
    //     key: 'id'
    //   }
    // }
  }, {
    tableName: 'chatbot_histories',
  });

  ChatbotHistory.associate = (models) => {
    ChatbotHistory.belongsTo(models.Chatbot, { 
      foreignKey: {
        name: 'chatbot_id',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKeyConstraint: { name: 'fk_chatbot_history_chatbot' }
    });
  };

  return ChatbotHistory;
};
