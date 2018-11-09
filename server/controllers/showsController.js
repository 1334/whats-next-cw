const fetch = require('node-fetch');

const db = require('../models/index');

const showsController = {};

showsController.recommended = async (_, res) => {
  const results = await db.Show.findAll({ where: {}, raw: true, limit: 20 });
  res.status(200).send(results);
};

showsController.get = async (req, res) => {
  const id = +req.params.showId;
  const show = await getShow(id);
  const similar = await db.Show.findAll({ where: { tmdbId: show.similar } });
  show.similar = similar;
  res.status(200).send(show);
};

showsController.markAsSeen = async (req, res) => {
  const user = await db.User.findByPk(req.userId);
  user.seen = user.seen.concat(req.params.showId);
  await user.save();
  res.status(200).send();
};

showsController.markToSee = async (req, res) => {
  const user = await db.User.findByPk(req.userId);
  user.toSee = user.toSee.concat(req.params.showId);
  await user.save();
  res.status(200).end();
};

async function getShow(id) {
  const localShow = await db.Show.findOne({ where: { tmdbId: id } });
  if (!localShow) return await createShow(id);

  if (completeInfo(localShow)) return localShow;
  else return await updateShowInfo(id);
}

function completeInfo(show) {
  return !!show.number_of_seasons && !!show.similar.length && !!show.tmdbBlob;
}

async function createShow(id) {
  const key = process.env.API_KEY;
  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${key}&append_to_response=similar`
  )
    .then(data => data.json())
    .then(async data => {
      const attrs = {
        tmdbId: data.id,
        name: data.name,
        backdrop_path: data.backdrop_path,
        poster_path: data.poster_path,
        number_of_seasons: data.number_of_seasons,
        vote_average: data.vote_average,
        overview: data.overview,
        similar: data.similar.results.map(el => el.id),
        genre_ids: data.genre_ids,
        tmdbBlob: data
      };
      const show = await db.Show.create(attrs);
      await createSimilarShows(data.similar.results);
      return show;
    });
}

async function updateShowInfo(id) {
  const show = await db.Show.findOne({ where: { tmdbId: id } });
  const key = process.env.API_KEY;

  return await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${key}&append_to_response=similar`
  )
    .then(data => data.json())
    .then(async data => {
      const attrs = {
        number_of_seasons: data.number_of_seasons,
        similar: data.similar.results.map(el => el.id),
        tmdbBlob: data
      };
      await show.update(attrs, { where: { tmdbId: data.id } });
      await createSimilarShows(data.similar.results);
      return show;
    });
}

async function createSimilarShows(showsArr) {
  await Promise.all(
    showsArr.map(async show => {
      const ss = await db.Show.findOne({ where: { tmdbId: show.id } });
      if (!ss) {
        await db.Show.create({
          tmdbId: show.id,
          name: show.name,
          backdrop_path: show.backdrop_path,
          poster_path: show.poster_path,
          vote_average: show.vote_average,
          overview: show.overview,
          genre_ids: show.genre_ids
        });
      }
    })
  );
}

module.exports = showsController;
