'use strict';
const md5 = require('md5');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        unique: true
      },
      avatar: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      authToken: {
        allowNull: false,
        type: DataTypes.STRING
      },
      facebookId: {
        allowNull: true,
        type: DataTypes.STRING
      },
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Tracking, { as: 'trackings', foreignKey: 'userId' });
    User.belongsToMany(models.Show, {
      through: models.Tracking,
      as: 'shows',
      foreignKey: 'userId'
    });
    User.belongsToMany(models.User, {
      through: models.Friend,
      as: 'following',
      foreignKey: 'following_id'
    });
    User.belongsToMany(models.User, {
      through: models.Friend,
      as: 'followers',
      foreignKey: 'follower_id'
    })
  };
  return User;
};
