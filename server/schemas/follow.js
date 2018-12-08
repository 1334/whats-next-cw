'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    follower_id: {
      allowNull: false,
      unique: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    following_id: {
      allowNull: false,
      unique: true,
      type: DataTypes.INTEGER, 
      references: {
        model: 'Users',
        key: 'id',
      }
    },
  }, {});
  Friend.associate = function(models) {
    Friend.belongsTo(models.User, { as: 'following', foreignKey: 'following_id' });
    Friend.belongsTo(models.User, { as: 'follower', foreignKey: 'follower_id' });
  };
  return Friend;
};