const request = require('supertest');
const app = require('../server');
const db = require('../schemas');
const trackingSeeder = require('../testSeeding/trackingSeeders');
const trackingController = require('../controllers/trackingController');
const usersController = require('../controllers/usersController');
const showModule = require('../models/showModel');
const mock = require('../mock_tests/mock');
const followModule = require('../models/followModel');
var dotenv = require('dotenv');
dotenv.load();

const thirdPartyAuthentication = require('../middlewares/thirdPartyAuthentication');

/**
 * In order to test the creation of the user the database needs to be reset
 */

describe('testing the user controller: creating user', () => {
  beforeAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterEach(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  it('respond with the user object', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'test1',
        password: 'password01',
        email: 'test1@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      name: 'test1',
      email: 'test1@hotmail.com',
      avatar: 'test'
    });
    expect(response.body.authToken).toBeTruthy();
  });
  it('Empty body should return 400', done => {
    return request(app)
      .post('/signup')
      .send({})
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });
  it('Empty name should return 400', done => {
    return request(app)
      .post('/signup')
      .send({
        name: '',
        password: 'password01',
        email: 'test3@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });

  it('Empty password should return 400', done => {
    return request(app)
      .post('/signup')
      .send({
        name: 'test5',
        password: '',
        email: 'test5@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });
  it('Empty email should return 400', done => {
    return request(app)
      .post('/signup')
      .send({
        name: 'test6',
        password: 'password01',
        email: '',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });
  it('Wrong email format should return 400', done => {
    return request(app)
      .post('/signup')
      .send({
        name: 'test7',
        password: 'password01',
        email: 'testtest',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });

  it('Empty profile picture should return 201 with standard picture', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'test9',
        password: 'password01',
        email: 'test9@hotmail.com',
        avatar: ''
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      name: 'test9',
      email: 'test9@hotmail.com',
      avatar:
        'https://res.cloudinary.com/diek0ztdy/image/upload/v1541756897/samples/sheep.jpg'
    });
    expect(response.body.authToken).toBeTruthy();
  });
});

describe('test the user controller: create user duplicate entries', () => {
  beforeAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('Duplicate email format should return 400', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'test8',
        password: 'password01',
        email: 'alice@example.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(400);
  });

  it('Duplicate username should return 400', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        name: 'Alice',
        password: 'password01',
        email: 'test4@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(400);
  });
});

/**
 *  Test facebook login
 */

describe('test the facebook signup functionality unit tests: ', () => {
  beforeAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  const verification = { isValid: true, userId: 200 };
  const mockVerification = jest.fn(() => verification);
  const req = {
    body: {
      email: 'test@gmail.com',
      name: 'arturo test',
      id: '898329',
      provider: 'facebook',
      token: 'test1test2',
      image: 'yes'
    }
  };
  const res = {
    body: '',
    status: jest.fn(() => res),
    send: jest.fn(text => {
      res.body = text;
      return res;
    })
  };
  const next = jest.fn();

  const thirdParty = jest.fn();

  it('Given the body of the front end the user should be created using the FB data', async () => {
    await usersController._facebookLogIn(req, res, next, mockVerification);
    expect(next).toHaveBeenCalledTimes(0);
    expect(mockVerification).toHaveBeenCalledWith(req.body.token);
    expect(res.body).toMatchObject({
      email: 'test@gmail.com'
    });
  });

  it('Given the body resulting from facebook login facebooklogin should be called', async () => {
    await usersController.create(req, res, next, thirdParty);
    expect(thirdParty).toHaveBeenCalledTimes(1);
  });
});

describe('Test the sign-in functionality: ', () => {
  it('Given a request without authorization header it should return error 400', async () => {
    const response = await request(app).get('/signin');
    expect(response.status).toBe(400);
  });

  it('Given a request with authorization header but incorrect email it should return error', async () => {
    const response = await request(app)
      .get('/signin')
      .auth('banana@gmail.com', 'blueberry');
    expect(response.status).toBe(400);
  });

  it('Given a request with authorization header but incorrect password it should return error', async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'test1',
        password: 'password01',
        email: 'test1@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json');

    const response = await request(app)
      .get('/signin')
      .auth('arturo@example.com', 'blueberry');
    expect(response.status).toBe(400);
  });

  it('Given a call to the sign in, the correct password and email should return a user object', async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'test1',
        password: 'password01',
        email: 'test1@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json');

    const response = await request(app)
      .get('/signin')
      .auth('test1@hotmail.com', 'password01');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: 'test1@hotmail.com'
    });
  });
});

/**
 *  Test user Get
 */

describe('testing the user controller: get user', () => {
  beforeAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  it('should return user with id 1', async () => {
    const response = await request(app)
      .get('/user/')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '1'
      });
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      name: 'Alice',
      email: 'alice@example.com',
      avatar: 'test'
    });
    expect(response.body.authToken).toBeTruthy();
  });
  it('Out of bounds token should return 400', async () => {
    const response = await request(app)
      .get('/user/')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2000'
      });
    expect(response.status).toEqual(400);
  });
  it('No token should return 400', async () => {
    const response = await request(app).get('/user/');
    expect(response.status).toEqual(400);
  });
});

/**
 * Test: Check if the interaction is correct and tracking is being called when necessary
 * Test: Check if the right item gets the review/ status and or rating
 * Test: Check the output
 * Test: Check for incorrect input
 */

describe('testing the tracking Controller: create status', () => {
  beforeAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  afterAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  it('respond with the movie object which includes the tracking', async () => {
    const response = await request(app)
      .post('/user/100/status')
      .send({
        status: 'seen'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      name: 'I Am Not an Animal',
      tracking: { rating: null, review: null, status: 'seen' }
    });
  });
  it('respond with status 400 if given incorrect userToken', async () => {
    const response = await request(app)
      .post('/user/100/status')
      .send({
        status: 'test',
        userId: 200
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '100'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if given incorrect movieId', async () => {
    const response = await request(app)
      .post('/user/20003030303/status')
      .send({
        status: 'test'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if given incorrect status', async () => {
    const response = await request(app)
      .post('/user/100/status')
      .send({
        status: 'test'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
});

/**
 * Test: Check if the interaction is correct and tracking is being called when necessary
 * Test: Check if the right item gets the review/ status and or rating
 * Test: Check the output
 * Test: Check for incorrect input
 */

describe('testing the tracking Controller: create review', () => {
  beforeAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  afterAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  it('respond with the movie object which includes the review', async () => {
    const response = await request(app)
      .post('/user/100/review')
      .send({
        review: 'Great'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      name: 'I Am Not an Animal',
      tracking: { rating: null, review: 'Great', status: 'none' }
    });
  });
  it('respond with status 400 if given incorrect token', async () => {
    const response = await request(app)
      .post('/user/100/review')
      .send({
        review: 'test'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2090'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if given incorrect movieId', async () => {
    const response = await request(app)
      .post('/user/20003030303/review')
      .send({
        review: 'Great'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
});

/**
 * Test: Check if the interaction is correct and tracking is being called when necessary
 * Test: Check if the right item gets the review/ status and or rating
 * Test: Check the output
 * Test: Check for incorrect input
 */

describe('testing the tracking Controller: create rating', () => {
  beforeAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  afterAll(async () => {
    await trackingSeeder.downTracking(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
  });

  it('respond with the movie object which includes the rating', async () => {
    const response = await request(app)
      .post('/user/100/rate')
      .send({
        rating: 5
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      name: 'I Am Not an Animal',
      tracking: { rating: 5, review: null, status: 'none' }
    });
  });
  it('respond with status 400 if given incorrect token', async () => {
    const response = await request(app)
      .post('/user/100/rate')
      .send({
        rating: 10
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2000'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if given incorrect movieId', async () => {
    const response = await request(app)
      .post('/user/20003030303/rate')
      .send({
        rating: 10
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if rating is NaN', async () => {
    const response = await request(app)
      .post('/user/20003030303/rate')
      .send({
        rating: 'seven'
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if rating is undefined', async () => {
    const response = await request(app)
      .post('/user/20003030303/rate')
      .send({
        rating: 10
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
  it('respond with status 400 if rating is out of bounds', async () => {
    const response = await request(app)
      .post('/user/20003030303/rate')
      .send({
        rating: 100
      })
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '2'
      });
    expect(response.status).toEqual(400);
  });
});

/**
 * Test: helpers
 */

describe('testing the tracking Controller: create status', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });
  afterEach(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  it('should response with an object with all movies unwrapped', async () => {
    const res = await trackingController._unwrapSimilar(100, 1);
    expect(res).toMatchObject({
      similar: [{ id: 125 }, { id: 135 }]
    });
  });
});

/**
 * Test: the show helper function
 */

describe('testing the helper shows: getShowForUser', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });
  afterEach(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('gets show when provided correct inputs', async () => {
    const response = await showModule.getShowForUser(100, 1);
    expect(response.dataValues).toMatchObject(mock.getShowForUserCorrect);
  });

  it('throw error when given incorrect inputs - 1', async () => {
    let message = false;
    try {
      await await showModule.getShowForUser(100, 'test');
    } catch (err) {
      message = err.message;
    }
    expect(message).toBeTruthy();
  });

  it('throw error when given incorrect inputs - 2', async () => {
    let message = false;
    try {
      await showModule.getShowForUser('test', 1);
    } catch (err) {
      message = err.message;
    }
    expect(message).toBeTruthy();
  });
});

describe('testing the helper shows: createOrUpdateShow', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  beforeEach(async () => {
    await trackingSeeder.upShows(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });
  afterEach(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('gets show when provided correct and complete inputs - third condition', async () => {
    const response = await showModule.createOrUpdateShow(
      100,
      mock.findShowByIdComplete
    );
    expect(response).toMatchObject(mock.findShowByIdComplete());
  });
  it('gets show when provided incomplete show - second condition', async () => {
    const response = await showModule.createOrUpdateShow(
      100,
      mock.findShowByIdIncomplete,
      mock.fetchCallback(100)
    );
    expect(response).toMatchObject({
      similar: [125, 135],
      recommendations: [145, 155]
    });
  });
  it('gets show when provided show not on database - first condition', async () => {
    const response = await showModule.createOrUpdateShow(
      2000,
      undefined,
      mock.fetchCallback(2000)
    );
    expect(response).toMatchObject({
      id: 2000,
      name: 'Test show 2000',
      similar: [125, 135]
    });
  });
  it('gets show when provided correct and complete inputs - third condition', async () => {
    const response = await showModule.createOrUpdateShow(
      1,
      mock.findShowByIdComplete
    );
    expect(response).toMatchObject(mock.findShowByIdComplete());
  });
});

describe('testing the show controller: search', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('return tv shows when provided correct movie search term', async () => {
    return await request(app)
      .post('/shows/search')
      .send({
        term: 'peep show'
      })
      .set('Content-Type', 'application/json')
      .expect(200, [
        { id: 815, name: 'Peep Show' },
        {
          id: 12063,
          name: 'Peep Show'
        }
      ]);
  });

  it('search term should be case insensitive', done => {
    return request(app)
      .post('/shows/search')
      .send({
        term: 'peEp sHow'
      })
      .set('Content-Type', 'application/json')
      .expect(
        200,
        [
          { id: 815, name: 'Peep Show' },
          {
            id: 12063,
            name: 'Peep Show'
          }
        ],
        done
      );
  });
  it('should return 400 for empty requests', done => {
    return request(app)
      .post('/shows/search')
      .send({
        term: ''
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  });
  it('should only return the first 20 results', async () => {
    const response = await request(app)
      .post('/shows/search')
      .send({
        term: 'a'
      })
      .set('Content-Type', 'application/json');
    expect(response.body).toHaveLength(20);
  });
});

describe('testing the show controller: id', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('responds with json containing recommended tv shows when given show name', async () => {
    const response = await request(app)
      .get('/shows/815')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '1'
      });

    expect(response.status).toEqual(200);
    expect(response.body.id.toString()).toMatch('815');
    const listOfRecommendedIds = response.body.recommendations
      .map(obj => obj.id)
      .every(number => number > 0);
    expect(listOfRecommendedIds).toEqual(true);
  });

  it('responds with 400 when given incorrect type show id', async () => {
    const response = await request(app)
      .get('/shows/test')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '1'
      });
    expect(response.status).toEqual(400);
  });

  it('responds with 400 when given incorrect number show id', async () => {
    const response = await request(app)
      .get('/shows/222222222')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '1'
      });
    expect(response.status).toEqual(400);
  });

  it('responds with 400 when given incorrect input', async () => {
    const response = await request(app)
      .get('/shows/2-2')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + '1'
      });
    expect(response.status).toEqual(400);
  });
});

describe('testing the follower module: toggle follow', () => {
  beforeAll(async () => {
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });
  afterEach(async () => {
    await trackingSeeder.downFollowing(db.sequelize.queryInterface);
  });

  afterAll(async () => {
    await trackingSeeder.downFollowing(db.sequelize.queryInterface);
    await trackingSeeder.downShows(db.sequelize.queryInterface);
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('userId 1 should follow userId 2', async () => {
    await followModule.toggleFollow(1, 2);
    const all = await followModule.findAll();
    expect(all).toMatchObject([
      {
        follower_id: 1,
        following_id: 2
      }
    ]);
  });

  it('userId 1 should follow userId 2 nad vice versa', async () => {
    await followModule.toggleFollow(1, 2);
    await followModule.toggleFollow(2, 1);
    const all = await followModule.findAll();
    expect(all).toMatchObject([
      {
        follower_id: 1,
        following_id: 2
      },
      {
        follower_id: 2,
        following_id: 1
      }
    ]);
  });

  it('userId 1 should follow and unfollow userId 2', async () => {
    await followModule.toggleFollow(1, 2);
    await followModule.toggleFollow(1, 2);
    const all = await followModule.findAll();
    expect(all).toMatchObject([]);
  });

  it('Find following for user 1 should return 2', async () => {
    await followModule.toggleFollow(1, 2);
    const all = await followModule.findFollowingForUser(1);
    expect(all).toMatchObject([
      {
        follower_id: 1,
        following_id: 2
      }
    ]);
  });

  it('Find followers for user 2 should return 1', async () => {
    await followModule.toggleFollow(1, 2);
    const all = await followModule.findFollowersForUser(2);
    expect(all).toMatchObject([
      {
        follower_id: 1,
        following_id: 2
      }
    ]);
  });

  it('Incorrect follower_id should return and error', async () => {
    let message = false;
    try {
      await followModule.toggleFollow(100, 2);
    } catch (err) {
      message = err.message;
    }
    expect(message).toBeTruthy();
  });

  it('Incorrect following_id should return and error', async () => {
    let message = false;
    try {
      await followModule.toggleFollow(1, 200);
    } catch (err) {
      message = err.message;
    }
    expect(message).toBeTruthy();
  });
});

/**
 * Test middleware
 */

describe('Test authentication middleware: ', () => {
  const token = process.env.USER_KEY;
  const testToken = 2;

  beforeAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });
  afterAll(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  beforeEach(async () => {
    await trackingSeeder.upUsers(db.sequelize.queryInterface);
  });

  afterEach(async () => {
    await trackingSeeder.downUsers(db.sequelize.queryInterface);
  });

  it('Given a valid user token verifyFacebook should return boolean true', async () => {
    expect(await thirdPartyAuthentication.verifyFacebook(token)).toMatchObject({
      isValid: true
    });
  });

  it('Given a manually optained fb object the method should return a created user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        email: 'test@gmail.com',
        name: 'arturo test',
        id: '898329',
        provider: 'facebook',
        token: token,
        image: 'yes'
      })
      .set('Content-Type', 'application/json');

    expect(response.body).toMatchObject({
      email: 'test@gmail.com',
      name: 'arturo test',
      authToken: token
    });
  });

  it('Given a manually optained fb object the method should return an updated user', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        email: 'test@gmail.com',
        name: 'bernardo',
        id: '898329',
        provider: 'facebook',
        token: token,
        image: 'yes'
      })
      .set('Content-Type', 'application/json');

    expect(response.body).toMatchObject({
      email: 'test@gmail.com',
      name: 'bernardo',
      authToken: token
    });
  });
  it('test authentication middleware: ', async () => {
    const response = await request(app)
      .get('/test')
      .set({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + testToken
      })
      .send({ test: true });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      test: true
    });
  });
});
