const { DataTypes, ForeignKeyConstraintError } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(255),
    status: DataTypes.BOOLEAN,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subscription: DataTypes.BOOLEAN,
    subscriptionType: {
      type: DataTypes.STRING(50),
      field: 'subscriptiontype'
    },
    userCount: {
      type: DataTypes.INTEGER,
      field: 'usercount'
    },
    promotion: DataTypes.STRING(255),
    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'service_type_id'
    },
    promo_code_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'promo_code_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'services',
    underscored: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['ServiceTypeId']
      }
    }
  });

  Service.associate = (models) => {
    Service.belongsTo(models.ServiceType, { 
      foreignKey: {
        name: 'service_type_id',
        field: 'service_type_id'
      },
      targetKey: 'id',
      as: 'serviceType',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Service.belongsTo(models.PromoCode, {
      foreignKey: {
        name: 'promo_code_id',
        field: 'promo_code_id'
      },
      targetKey: 'id',
      as: 'promoCode',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    Service.belongsToMany(models.Role, {
      through: models.ServiceRole,
      foreignKey: 'service_id',
      otherKey: 'role_id',
      as: 'roles',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Service.belongsToMany(models.OrderItem, {
      through: models.OrderItemService,
      foreignKey: 'service_id',
      otherKey: 'order_item_id',
      as: 'orderItems',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Service.hasMany(models.Review, {
      foreignKey: 'service_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Service;
};
