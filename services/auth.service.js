'use strict'

const {
  findOne,
  createOne
} = require('../repository/commonRepository')
const User = require('../model/users')
const bcrypt = require('bcryptjs')
const SERVICE_CON = 'AS_AS_'
const Joi = require('joi')
const AppError = require('../utils/appError')
const { generateToken } = require('./token.service')

const signUpSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required(),
  confirmPassword: Joi.string().equal(Joi.ref('password')).required()
})

const signinSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required()
})

const createNewUser = async (body) => {
  console.debug('createNewUser() body: %j', body)
  await validateInputBody(signUpSchema, body)
  await isUserExist(body.email)
  const userDetails = await saveUserDetails(body)
  const response = finalResponse(userDetails)
  return response
}

function finalResponse (userDetails) {
  return {
    name: userDetails.name,
    email: userDetails.email
  }
}

async function saveUserDetails (body) {
  console.debug('saveUserDetails() body: %j', body)
  if (body.confirmPassword) {
    delete body.confirmPassword
  }
  const userDetails = await createOne(dataToBeSaved(body), User)
  if (userDetails && userDetails.password) {
    delete userDetails.password
  }
  console.debug('User details: %j', userDetails)
  return userDetails
}

function dataToBeSaved (body) {
  const finalBody = {}
  finalBody.name = body.name
  finalBody.email = body.email
  finalBody.password = hashThePassword(body.password)
  return finalBody
}

function hashThePassword (password) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

async function isUserExist (email) {
  const userDetails = await findOne(queryUsers(email), projectionUsers(), User)
  if (userDetails && userDetails._id) {
    console.debug('User already exists: ', email)
    throw new AppError(null, SERVICE_CON + 409, 'User already exist.', 'User already exist with the same email.')
  }
}

function queryUsers (email) {
  return {
    email: email,
    is_deleted: false
  }
}

function projectionUsers () {
  return {
    _id: true
  }
}

async function validateInputBody (schema, body) {
  try {
    const value = await schema.validateAsync(body)
    console.debug('Validation response: %j', value)
    return value
  } catch (error) {
    console.error('Error while validating input body: %s %j', error, error)
    throw new AppError(null, SERVICE_CON + 206, 'Partial content', error)
  }
}

const authenticateUser = async (body) => {
  await validateInputBody(signinSchema, body)
  const userDetails = await getUserDetails(body)
  const response = await prepareFinalResponse(userDetails)
  return response
}

async function prepareFinalResponse (userDetails) {
  const tokenDetails = await generateToken(userDetails._id)
  console.debug('Token details: %j', tokenDetails)
  const response = {}
  response.name = userDetails.name
  response.email = userDetails.email
  response.token = tokenDetails.data.token
  response.expireAt = tokenDetails.data.expireAt
  response.userId = userDetails._id
  response.path = '/user'
  return response
}

async function getUserDetails (body) {
  const userDetails = await findOne(queryUsers(body.email), projectionUserDetails(), User)
  console.debug('User details: %j', userDetails)
  if (userDetails) {
    await comparePassword(body.password, userDetails.password, body.email)
  } else {
    inValidCredentials(body.email)
  }
  return userDetails
}

async function comparePassword (inputPassword, password, email) {
  const isPasswordMatch = await bcrypt.compare(inputPassword, password)
  if (!isPasswordMatch) {
    inValidCredentials(email)
  }
}

function inValidCredentials (email) {
  console.error('Wrong credentials: %s', email)
  throw new AppError(null, SERVICE_CON + 400, 'Invalid credentials',
    'Invalid credentials')
}

function projectionUserDetails () {
  return {
    name: true,
    password: true,
    email: true
  }
}

module.exports = {
  createNewUser,
  authenticateUser
}
