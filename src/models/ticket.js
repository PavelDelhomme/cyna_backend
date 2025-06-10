const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 2000]
      }
    },
    status: {
      type: DataTypes.ENUM('nouveau', 'ouvert', 'en_cours', 'resolu', 'ferme'),
      allowNull: false,
      defaultValue: 'nouveau'
    },
    type: {
      type: DataTypes.ENUM('support_technique', 'question_produit', 'question_service', 'probleme_commande', 'remboursement', 'autre'),
      allowNull: false,
      defaultValue: 'autre'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de l\'admin assigné au ticket'
    },
    admin_response: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Réponse de l\'administrateur'
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tickets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['type']
      }
    ]
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      foreignKeyConstraint: { name: 'fk_ticket_user' }
    });
    
    Ticket.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignedTo',
      foreignKeyConstraint: { name: 'fk_ticket_assigned_user' }
    });

    Ticket.hasMany(models.TicketMessage, {
      foreignKey: 'ticket_id',
      as: 'messages'
    });
  };

  return Ticket;
};
