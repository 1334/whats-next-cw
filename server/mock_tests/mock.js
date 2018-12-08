const mock = {};

mock.getShowForUserCorrect = {
  id: 100,
  name: "I Am Not an Animal",
 };
 
mock.findShowByIdComplete = () => {
  return {
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
  };
};



mock.findShowByIdIncomplete = () => {
  return {
    id: 100,
    name: "I Am Not an Animal",
    backdrop_path: "/o8Site0BMZ8xhknKJ0m52iLfqHg.jpg",
    poster_path: "/nMhv6jG5dtLdW7rgguYWvpbk0YN.jpg",
    number_of_seasons: 1,
    vote_average: 9.7,
    overview: "I Am Not An Animal is an animated comedy series about the only six talking animals in the world, whose cosseted existence in a vivisection unit is turned upside down when they are liberated by animal rights activists.",
    similar: [],
    recommendations: [],
    genre_ids: [16, 35],
  };
};

mock.fetchCallback = (id) => {
  return (idTest) => {
    if (idTest === id) {
      return {
        id: id,
        name: 'Test show ' + id,
        backdrop_path: 'backdrop_test ' + id,
        poster_path: 'poster_test ' + id,
        number_of_seasons: id,
        vote_average: 8,
        overview: 'Great show ' + id,
        genre_ids: [1,2,3,4,5],
        createdAt: new Date(),
        updatedAt: new Date(),
        similar: {results:[{id:125},{id:135}]},
        recommendations: {results:[{id:145},{id:155}]}
      }
    }
  }
}

module.exports = mock;