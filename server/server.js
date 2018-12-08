require('dotenv').config();
const express = require('express');
const bodyParser = express.json();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./router.js');
//const userMiddleware = require('./middewares/authMiddleware.js');
const app = new express();

app
  .use(cors())
  .use(bodyParser)
  .use(router)
  .use((req, res) => {
    res.status(404).send(`Nothing to see here. ${req.path} not found!`);
  });

module.exports = app;
