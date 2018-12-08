'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define(
    'Tracking',
    {
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 10
        }
      },
      status: {
        type: DataTypes.ENUM('seen','toSee','seeing', 'none'),
        defaultValue: 'none'
      },
      review: DataTypes.STRING
    },
    {}
  );
  Tracking.associate = function(models) {
    Tracking.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Tracking.belongsTo(models.Show, { as: 'show', foreignKey: 'showId' });
  };
  return Tracking;
};
