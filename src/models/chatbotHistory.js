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
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ChatbotHistory.associate = (models) => {
    ChatbotHistory.belongsTo(models.Chatbot, { 
      foreignKey: {
        name: 'chatbot_id',
        allowNull: false
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE' 
    });
  };

  return ChatbotHistory;
};
