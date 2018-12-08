const express = require('express');
const router = express.Router();
const showsController = require('./controllers/showsController.js');
const usersController = require('./controllers/usersController');
const trackingController = require('./controllers/trackingController');
// const followController = require('./controllers/followController');
const authMiddleware = require('./middlewares/authMiddleware');

const nextFunction = (req, res) => {
  res.status(200).send(req.body);
};

router
  .get('/recommended', authMiddleware, showsController.recommended)
  .post('/shows/search', showsController.search)
  .get('/shows/:id', authMiddleware, showsController.get)
  .post('/signup', usersController.create)
  .get('/signin', usersController.signIn)
  .get('/user/', authMiddleware, usersController.get)
  .post('/user/:id/status', authMiddleware, trackingController.status)
  .post('/user/:id/rate', authMiddleware, trackingController.rate)
  .post('/user/:id/review', authMiddleware, trackingController.review)
  .get('/test', authMiddleware, nextFunction);

module.exports = router;
