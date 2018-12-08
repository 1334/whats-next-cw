'use strict';
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    'Genre',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: DataTypes.STRING
    },
    {}
  );

  return Genre;
};
