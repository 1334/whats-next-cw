const showModule = require('../models/showModel');
const showsController = {};

showsController.recommended = async (req, res) => {
  const userId = req.user.id;
  const trackedShows = await showModule.findTrackedShows(userId);
  const trackedShowsIds = trackedShows.map(el => el.showId);
  const shows = await showModule.findShows(trackedShowsIds,userId);
  const fullShows = await showModule.findFullShows(shows);
  res.status(200).send(fullShows);
};

showsController.get = async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
    try {
      await showModule.createOrUpdateShow(id);
      const show = await showModule.getShowForUser(id, userId);
      const similar = await showModule.findSimilar(show);
      show.similar = similar;
      const recommendations = await showModule.findRecommendations(show);
      show.recommendations = recommendations;
      res.status(200).send(show);
    }
    catch (error) {
      res.status(400).send();
    }
};

showsController.search = async (req, res) => {
  const { term } = req.body;
  if (!term) res.status(400).end();
  try {
    const results = await showModule.searchShows(term);
    res.status(200).send(results);
  }
  catch (error) {
    res.status(400).end();
  }
};

module.exports = showsController;
