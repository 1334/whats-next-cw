const trackingController = {};
const trackingModule = require('../models/trackingModel');
const showModule = require('../models/showModel')

trackingController.status = async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;
  const status = req.body.status;
  try {
    await trackingModule.findOrCreateStatus(userId, movieId, status);
    const show = await trackingController._unwrapSimilar(movieId, userId);
    res.status(201).send(show);
  } catch (error) {
    res.status(400).send();
  }
};

// returns a show with all the movies in the similar property
trackingController._unwrapSimilar = async (movieId, userId) => {
  const show = await showModule.getShowForUser(movieId, userId);
  const similar = await showModule.findAll(show.similar);
  show.similar = similar;
  return show;
}


trackingController.rate = async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;
  const rating = req.body.rating;
  try {
    await trackingModule.findOrCreateRating(userId, movieId, rating);
    const show = await trackingController._unwrapSimilar(movieId, userId);
    res.status(201).send(show);
  } catch (error) {
    //console.log(error);
    res.status(400).send();
  }
};

// check in detail

trackingController.review = async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;
  const review = req.body.review;
  
  try {
    await trackingModule.findOrCreateReview(userId, movieId, review);
    const show = await trackingController._unwrapSimilar(movieId, userId);
    res.status(201).send(show);
  } catch (error) {
    //console.log(error);
    res.status(400).send();
  }
};

module.exports = trackingController;
