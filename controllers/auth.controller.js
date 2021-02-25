'use strict'

const {
  createNewUser,
  authenticateUser
} = require('../services/auth.service')
const { getStatusCode } = require('../utils/statusCode')
const CONTROLLER_CONS = 'CMS_AC_'

const createUser = async (req, res) => {
  try {
    const respose = await createNewUser(req.body)
    res.status(201).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'User registered successfully.',
      errors: null
    })
  } catch (error) {
    console.error('Error while registering user: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      let errors = error
      if (error.errors) {
        errors = error.errors
      }
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: errors
      })
    }
  }
}

const signinUser = async (req, res) => {
  try {
    const respose = await authenticateUser(req.body)
    res.status(200).json({
      data: respose,
      status_code: CONTROLLER_CONS + 200,
      status_message: 'User signin successfully.',
      errors: null
    })
  } catch (error) {
    console.error('Error while authenticating user: %s %j', error, error)
    if (getStatusCode(error.status_code)) {
      res.status(getStatusCode(error.status_code)).send(error)
    } else {
      let errors = error
      if (error.errors) {
        errors = error.errors
      }
      res.status(500).json({
        data: null,
        status_code: CONTROLLER_CONS + 500,
        status_message: 'Server error',
        errors: errors
      })
    }
  }
}

module.exports = {
  createUser,
  signinUser
}
