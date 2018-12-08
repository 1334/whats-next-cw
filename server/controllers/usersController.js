const usersController = {};
const userModule = require('../models/userModel');
const bcrypt = require('bcrypt');
const btoa = require('atob');
const uuid = require('uuid/v4');
const thirdPartyAuthentication = require('../middlewares/thirdPartyAuthentication');

usersController.get = async (req, res) => {
  return res.status(200).send({
      name: req.user.name,
      email: req.user.email,
      authToken: req.user.authToken,
      avatar: req.user.avatar
    });
};

usersController.create = async (
  req,
  res,
  next,
  thirdPartyLogin = usersController._facebookLogIn
) => {
  if (req.body.provider === 'facebook') return thirdPartyLogin(req, res);

  const { name, password, email, avatar } = req.body;
  let hash;

  if (!name || !password || !email) {
    res.status(400).send({
      errors: ['name, password or email missing']
    });
    return;
  }
  let user = await userModule.getUserByEmail(email);
  if (user) {
    res.status(400).send({
      errors: ['email already in use']
    });
    return;
  } else {
    try {
      hash = await bcrypt.hash(password, +process.env.PASSWORD_HASH);
    } catch (error) {
      throw new Error('Problem in hash function');
    }
    try {
      const authToken = uuid();
      const userDb = await userModule.createUser(
        name,
        hash,
        email,
        avatar,
        authToken
      );
      res.status(201).send({
        name: userDb.name,
        email: userDb.email,
        authToken: userDb.authToken,
        avatar: userDb.avatar
      });
    } catch (error) {
      res.status(400).send();
    }
  }
};

usersController._facebookLogIn = async (
  req,
  res,
  next,
  verifyFacebook = thirdPartyAuthentication.verifyFacebook
) => {

  const { id, image, name, token, email } = req.body;

  const verification = await verifyFacebook(token);
  console.log('verification: ', verification)
  const password = uuid();

  if (verification.isValid) {
    try {
      const userDb = await userModule.findOrCreateUser(
        name,
        password,
        email,
        image,
        token,
        id
      );
      res.status(201).send({
        name: userDb.name,
        email: userDb.email,
        authToken: userDb.authToken,
        avatar: userDb.avatar
      });
    } catch (error) {
      console.log(error);
      res.status(400).send();
    }
  } else {
    res.status(400).send({
      error: ['FB verification failure']
    });
  }
};

usersController.signIn = async (
  req,
  res,
  next,
  thirdPartyLogin = usersController._facebookLogIn
) => {
  let basic;

  if (req.body.provider === 'facebook') return thirdPartyLogin(req, res);

  if (!req.headers.authorization) {
    res.status(400).send({
      errors: ['Missing authentication header']
    });
    return;
  }

  basic = req.headers.authorization.split(' ');
  if (basic.length < 2 && basic[0] != 'Basic') {
    res.status(400).send({ error: ['Missing basic authentication header'] });
    return;
  }

  const [username, password] = btoa(basic[1]).split(':');
  const userDb = await userModule.getUserByEmail(username);

  if (!userDb) {
    res.status(400).send({
      errors: ['Incorrect email']
    });
    return;
  }
  try {
    const match = await bcrypt.compare(password, userDb.password);
    if (match) {
      res.status(200).send({
        name: userDb.name,
        email: userDb.email,
        authToken: userDb.authToken,
        avatar: userDb.avatar
      });
    } else {
      res.status(400).send({
        errors: ['Incorrect password']
      });
    }
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: ['Incorrect password']
    });
    return;
  }
};

module.exports = usersController;
