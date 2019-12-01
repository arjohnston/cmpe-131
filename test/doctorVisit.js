/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Import the model being tested
const DoctorVisit = require('../api/models/DoctorVisit')
const User = require('../api/models/User')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const expect = chai.expect
const { OK, UNAUTHORIZED, BAD_REQUEST } = require('../util/statusCodes')

// Setup Chai
chai.should()
chai.use(chaiHttp)

let serverInstance = null
let app = null

function initializeServer () {
  serverInstance = new server.Server()
  serverInstance.openConnection()
  app = serverInstance.getServerInstance()
}

function terminateServer (done) {
  serverInstance.closeConnection(done)
}

// Parent block for the User tests
describe('Doctor Visit', () => {
  // Clear the database before the test beings
  before(done => {
    initializeServer()

    DoctorVisit.deleteMany({}, err => {
      if (err) {
        // Ignore the error
      }
    })

    User.deleteMany({}, err => {
      if (err) {
        // Ignore the error
      }
      done()
    })
  })
  after(done => {
    terminateServer(done)
  })

  // Set a variable for the token that will be created during the login process
  // Used to access other APIs
  let token = ''

  describe('/POST /api/doctorVisit/submit', () => {
    // Register a user
    it('Should register a user', done => {
      const user = {
        username: 'b@b.c',
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
        username: 'b@b.c',
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
        .post('/api/doctorVisit/submit')
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
        .post('/api/doctorVisit/submit')
        .send({ token: 'Invalid Token' })
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when submitting an empty object', done => {
      chai
        .request(app)
        .post('/api/doctorVisit/submit')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when submitting an object with notes and date', done => {
      chai
        .request(app)
        .post('/api/doctorVisit/submit')
        .send({ token: token, notes: 'Sample notes', date: Date.now() })
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST /api/doctorVisit/getEntries', () => {
    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/doctorVisit/getEntries')
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
        .post('/api/doctorVisit/getEntries')
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

  describe('/POST /api/doctorVisit/deleteAll', () => {
    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/doctorVisit/deleteAll')
        .send({})
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return OK when all entries have been deleted', done => {
      chai
        .request(app)
        .post('/api/doctorVisit/deleteAll')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
