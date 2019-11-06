const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const DoctorVisit = require('../models/DoctorVisit')
const config = require('../../util/settings')
const { OK, UNAUTHORIZED, BAD_REQUEST } = require('../../util/statusCodes')

// Submit an entry
router.post('/submit', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  const data = {
    date: req.body.date,
    notes: req.body.notes
  }

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      DoctorVisit.create(data, (error, post) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.json(post)
      })
    }
  })
})

// Return an array of objects of entries
router.post('/getEntries', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      DoctorVisit.find({}, (error, entries) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.status(OK).send(entries)
      })
    }
  })
})

module.exports = router
