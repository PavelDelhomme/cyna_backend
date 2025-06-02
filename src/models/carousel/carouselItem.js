module.exports = (sequelize, DataTypes) => {
  const CarouselItem = sequelize.define('CarouselItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'carousel_items',
    timestamps: false
  });

  return CarouselItem;
};