const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address1: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    line2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postalcode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'addresses',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Address.associate = (models) => {
    Address.belongsToMany(models.UserProfile, {
      through: {
        model: models.AddressUserProfile,
        unique: false
      },
      foreignKey: "address_id",
      otherKey: "user_profile_id",
      as: "address"
    });
    
    Address.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Address;
}; 