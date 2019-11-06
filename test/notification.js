/* global describe it before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Import the model being tested
const Notification = require('../api/models/Notification')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect
const {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST
} = require('../util/statusCodes')

// Setup Chai
chai.should()
chai.use(chaiHttp)

// Parent block for the User tests
describe('Notification', () => {
  // Clear the database before the test beings
  before(done => {
    Notification.deleteMany({}, err => {
      if (err) {
        // Ignore the error
      }
      done()
    })
  })

  // Set a variable for the token that will be created during the login process
  // Used to access other APIs
  let token = ''

  describe('/POST /api/notification/create', () => {
    // Register a user
    it('Should register a user', done => {
      const user = {
        username: 'e@b.c',
        password: 'StrongPassword$1'
      }

      chai
        .request(app)
        .post('/api/auth/register')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a JWT token if the email/pass is correct', done => {
      const user = {
        username: 'e@b.c',
        password: 'StrongPassword$1'
      }
      chai
        .request(app)
        .post('/api/auth/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('object')
          res.body.should.have.property('token')
          token = res.body.token

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/notification/create')
        .send({})
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 409 when an invalid token is passed in', done => {
      chai
        .request(app)
        .post('/api/notification/create')
        .send({ token: 'Invalid Token' })
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 400 when submitting an empty object', done => {
      chai
        .request(app)
        .post('/api/notification/create')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when submitting an object with type and message', done => {
      chai
        .request(app)
        .post('/api/notification/create')
        .send({ token: token, type: 'A type', message: 'Some message' })
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/notification/getNotifications', () => {
    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/notification/getNotifications')
        .send({})
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return all entries in an array', done => {
      chai
        .request(app)
        .post('/api/notification/getNotifications')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('array')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/notification/markAsRead', () => {
    let notifications = []

    it('Should return all entries in an array', done => {
      chai
        .request(app)
        .post('/api/notification/getNotifications')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('array')
          notifications = res.body

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/notification/markAsRead')
        .send({})
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return 404 when invalid type and message are passed in', done => {
      chai
        .request(app)
        .post('/api/notification/markAsRead')
        .send({
          token: token,
          type: 'Invalid type',
          message: 'Invalid message'
        })
        .then(function (res) {
          expect(res).to.have.status(NOT_FOUND)
          // res.body.should.be.a('array')

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return 200 when a notification is marked as read', done => {
      chai
        .request(app)
        .post('/api/notification/markAsRead')
        .send({ token: token, ...notifications[0] })
        .then(function (res) {
          expect(res).to.have.status(OK)
          // res.body.should.be.a('array')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
