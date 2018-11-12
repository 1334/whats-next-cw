const usersController = {};
const helpers = require('./helpers');
const db = require('../models/index');
const Op = db.Sequelize.Op;

usersController.get = async (req, res) => {
  const user = await helpers.getUser(req.userId);
  res.status(200).send(user);
};

usersController.status = async (req, res) => {
  const tmdbId = +req.params.tmdbId;
  const userId = +req.userId;
  const show = await helpers.getShowForUser(tmdbId, userId);

  await db.Tracking.findOrCreate({
    where: { userId, showId: show.id },
    defaults: { status: req.body.status }
  })
    .spread(tracking => {
      tracking.status = req.body.status;
      return tracking;
    })
    .then(tracking => tracking.save());

  const similar = await db.Show.findAll({
    where: { tmdbId: show.similar, backdrop_path: { [Op.ne]: null } }
  });
  show.similar = similar;
  res.status(200).send(show);
};

usersController.rate = async (req, res) => {
  const tmdbId = +req.params.tmdbId;
  const userId = +req.userId;
  const show = await helpers.getShowForUser(tmdbId, userId);

  await db.Tracking.findOrCreate({
    where: { userId, showId: show.id },
    defaults: { rating: req.body.rating }
  })
    .spread(tracking => {
      tracking.rating = req.body.rating;
      return tracking;
    })
    .then(tracking => tracking.save());

  const similar = await db.Show.findAll({
    where: { tmdbId: show.similar, backdrop_path: { [Op.ne]: null } }
  });
  show.similar = similar;
  res.status(200).send(show);
};

module.exports = usersController;
