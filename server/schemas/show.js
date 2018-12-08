'use strict';
module.exports = (sequelize, DataTypes) => {
  const Show = sequelize.define(
    'Show',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: DataTypes.STRING,
      backdrop_path: DataTypes.STRING,
      poster_path: DataTypes.STRING,
      number_of_seasons: DataTypes.INTEGER,
      vote_average: DataTypes.FLOAT,
      overview: DataTypes.TEXT,
      similar: DataTypes.ARRAY(DataTypes.DECIMAL),
      recommendations: DataTypes.ARRAY(DataTypes.DECIMAL),
      genre_ids: DataTypes.ARRAY(DataTypes.DECIMAL)
    },
    {}
  );
  Show.associate = function(models) {
    Show.hasOne(models.Tracking, { as: 'tracking', foreignKey: 'showId' });
    Show.belongsToMany(models.User, {
      through: models.Tracking,
      as: 'users',
      foreignKey: 'showId'
    });
  };
  return Show;
};
