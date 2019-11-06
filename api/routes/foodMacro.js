const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const FoodMacro = require('../models/FoodMacro')
const config = require('../../util/settings')
const { OK, UNAUTHORIZED, BAD_REQUEST } = require('../../util/statusCodes')

// Submit an entry
router.post('/create', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  const data = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    calories: req.body.calories
  }

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      FoodMacro.create(data, (error, post) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.json(post)
      })
    }
  })
})

// Return an array of objects of entries
router.post('/getMacros', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      FoodMacro.find({}, (error, entries) => {
        if (error) {
          return res.sendStatus(BAD_REQUEST)
        }

        return res.status(OK).send(entries)
      })
    }
  })
})

module.exports = router
