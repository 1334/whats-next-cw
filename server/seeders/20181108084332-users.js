'use strict';

const md5 = require('md5');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password01',
      avatar: 'test',
      authToken: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      name: 'Arturo',
      email: 'arturo@example.com',
      password: 'password01',
      avatar: 'test',
      authToken: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
