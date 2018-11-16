const request = require('supertest');
const app = require('../server');
const helpers = require('../controllers/helpers')


describe('testing the user controller', () => {
  it('responds with json', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: 'test',
        password: 'password01',
        email: 'test@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(201, {
        name: 'test',
        email: 'test@hotmail.com',
        avatar: 'test'
      }, done);
  })
  it('Empty body should return 400', (done) => {
    return request(app)
      .post('/user')
      .send({
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  })
  it('Empty name should return 400', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: '',
        password: 'password01', 
        email: 'test@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  })
  it('Empty password should return 400', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: 'test2',
        password: '', 
        email: 'test@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  })
  it('Empty email should return 400', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: 'test3',
        password: 'password01', 
        email: '',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  })
  it('Empty profile picture should return 201 with standard picture', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: 'test4',
        password: 'password01',
        email: 'test@hotmail.com',
        avatar: ''
      })
      .set('Content-Type', 'application/json')
      .expect(201, {
        name: 'test5',
        email: 'test@hotmail.com',
        avatar: 'standard'
      }, done);
  })
  it('Empty profile picture should return 201 with standard picture', (done) => {
    return request(app)
      .post('/user')
      .send({
        name: 'test1',
        password: 'password01',
        email: 'test@hotmail.com',
        avatar: 'test'
      })
      .set('Content-Type', 'application/json')
      .expect(400, done);
  })
})


// should succeed
// Send req.userId 

// router
//   .get('/recommended', showsController.recommended)
/**
 * When send req with userId should give back 
 */
//   .post('/shows/search', showsController.search)
//   .get('/shows/:id', showsController.get)
//   .get('/user', usersController.get)
//   .post('/user/:id/status', usersController.status)
//   .post('/user/:id/rate', usersController.rate);

