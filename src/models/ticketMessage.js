const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketMessage = sequelize.define('TicketMessage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tickets',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 2000]
      }
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'true si le message vient d\'un admin, false si c\'est l\'utilisateur'
    }
  }, {
    tableName: 'ticket_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['ticket_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  TicketMessage.associate = (models) => {
    TicketMessage.belongsTo(models.Ticket, {
      foreignKey: 'ticket_id',
      as: 'ticket'
    });
    
    TicketMessage.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return TicketMessage;
}; 