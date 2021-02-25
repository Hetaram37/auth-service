const route = require('express').Router()
const {
  createUser,
  signinUser
} = require('../controllers/auth.controller')

route.post('/v1/signup', createUser)
route.post('/v1/signin', signinUser)

module.exports = route
