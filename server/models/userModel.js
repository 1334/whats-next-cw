const userModule = {};
const db = require('../schemas');
const Op = db.Sequelize.Op;

userModule.getUser = async id => {
  const user = await db.User.findOne({
    where: { id: id },
    include: [
      {
        association: 'shows',
        through: {
          attributes: ['status', 'rating', 'review', 'createdAt'],
          as: 'tracking',
          where: { status: { [Op.ne]: 'none' } }
        }
      }
    ],
    order: [['shows', 'tracking', 'createdAt', 'DESC']]
  });
  return user.get({ plain: true });
};

userModule.getUserByEmail = async email => {
  const user = await db.User.findOne({
    where: {
      email: email
    }
  });
  return user;
};

userModule.getUserByToken = async token => {
  const user = await db.User.findOne({
    where: {
      authToken: token
    }
  });
  return user.get({ plain: true });
};

userModule.createUser = (name, password, email, avatar, authToken) => {
  if (!avatar)
    avatar =
      'https://res.cloudinary.com/diek0ztdy/image/upload/v1541756897/samples/sheep.jpg';
  return db.User.create({
    name: name,
    password: password,
    email: email,
    avatar: avatar,
    authToken: authToken
  });
};

userModule.findOrCreateUser = async (
  name,
  password,
  email,
  avatar,
  authToken,
  facebookId
) => {
  if (!avatar)
    avatar =
      'https://res.cloudinary.com/diek0ztdy/image/upload/v1541756897/samples/sheep.jpg';
  const test = await db.User.findOne({
    where: {
      email: email
    }
  });
  console.log(test);

  return db.User.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      name: name,
      password: password,
      avatar: avatar,
      authToken: authToken,
      facebookId: facebookId
    }
  })
    .spread(user => {
      user.name = name;
      user.password = password;
      user.avatar = avatar;
      user.authToken = authToken;
      user.facebookId = facebookId;
      return user;
    })
    .then(user => user.save());
};

module.exports = userModule;
