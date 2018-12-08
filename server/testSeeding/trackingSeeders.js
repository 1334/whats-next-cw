'use strict';
module.exports = {
  upShows: queryInterface => {
    return queryInterface.bulkInsert(
      'Shows',[{
          id: 100,
          name: "I Am Not an Animal",
          backdrop_path: "/o8Site0BMZ8xhknKJ0m52iLfqHg.jpg",
          poster_path: "/nMhv6jG5dtLdW7rgguYWvpbk0YN.jpg",
          number_of_seasons: 1,
          vote_average: 9.7,
          overview: "I Am Not An Animal is an animated comedy series about the only six talking animals in the world, whose cosseted existence in a vivisection unit is turned upside down when they are liberated by animal rights activists.",
          similar: [125, 135],
          recommendations: [145, 155],
          genre_ids: [16, 35],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 125,
          name: "Test2",
          backdrop_path: "/o8Site0BMZ8xhknKJ0m52iLfqHg.jpg",
          poster_path: "/nMhv6jG5dtLdW7rgguYWvpbk0YN.jpg",
          number_of_seasons: 1,
          vote_average: 9.7,
          overview: "I Am Not An Animal is an animated comedy series about the only six talking animals in the world, whose cosseted existence in a vivisection unit is turned upside down when they are liberated by animal rights activists.",
          similar: [125, 135],
          recommendations: [145, 155],
          genre_ids: [16, 35],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 135,
          name: "Test3",
          backdrop_path: "/o8Site0BMZ8xhknKJ0m52iLfqHg.jpg",
          poster_path: "/nMhv6jG5dtLdW7rgguYWvpbk0YN.jpg",
          number_of_seasons: 1,
          vote_average: 9.7,
          overview: "I Am Not An Animal is an animated comedy series about the only six talking animals in the world, whose cosseted existence in a vivisection unit is turned upside down when they are liberated by animal rights activists.",
          similar: [125, 135],
          recommendations: [145, 155],
          genre_ids: [16, 35],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
  },
  upUsers: queryInterface => {
    return queryInterface.bulkInsert('Users', [{
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password01',
        avatar: 'test',
        authToken: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        id: 2,
        name: 'Arturo',
        email: 'arturo@example.com',
        password: 'password01',
        avatar: 'test',
        authToken: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      }])
  },
  downShows: queryInterface => {
    return queryInterface.bulkDelete('Shows', null, {});
  },
  downUsers: queryInterface => {
    return queryInterface.bulkDelete('Users', null, {});
  },
  downTracking: queryInterface => {
    return queryInterface.bulkDelete('Trackings',null, {} )
  },
  downFollowing: queryInterface => {
    return queryInterface.bulkDelete('Friends', null, {})
  }
};


