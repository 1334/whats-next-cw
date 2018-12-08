'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trackings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false
      },
      review: {
        type: Sequelize.STRING
      },
      showId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shows',
          key: 'id'
        },
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 10
        }
      },
      status: {
        type: Sequelize.ENUM('seen','toSee','seeing', 'none'),
        defaultValue: 'none'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Trackings');
  }
};
