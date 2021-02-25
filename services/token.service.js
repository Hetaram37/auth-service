'use strict'

const axios = require('axios')
const config = require('config')
const tokenMgmtConfig = config.get('tokenMgmtService')

const generateToken = async (userId) => {
  console.log('Generate token() userId: %s', userId)
  let url = tokenMgmtConfig.protocol + '://' + tokenMgmtConfig.host + ':' + tokenMgmtConfig.port + tokenMgmtConfig.generateToken
  url = url.replace(':userId', userId)
  const apiConfig = {
    method: 'GET',
    url: url,
    headers: {
      Accept: 'application/json'
    },
    timeout: 3000,
    maxContentLength: 2000
  }
  console.debug('Generate token API config: %j', apiConfig)
  try {
    const response = await axios(apiConfig).then((response) => {
      return response.data
    })
    return response
  } catch (error) {
    console.error('Error while generating token: %s %j', error, error)
    throw error
  }
}

module.exports = {
  generateToken
}
