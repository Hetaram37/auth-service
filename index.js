'use strict'

const path = require('path')
const express = require('express')
const helmet = require('helmet')
const app = express()
const http = require('http')
const config = require('config')
const mongoose = require('mongoose')

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Body parser, reading data from body into req.body
app.use(express.json({
  limit: '10kb'
}))
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}))

mongoose
  .connect('mongodb://127.0.0.1:27017/school', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))

require('./routes')(app)

app.all('*', (req, res, next) => {
  res.status(404).json({
    data: null,
    status_code: 'CMS_' + 404,
    status_message: 'Path not found',
    errors: `Can't find ${req.originalUrl} on this server!`
  })
})

const server = http.createServer(app)

const port = config.port || 3000
server.listen(port, () => {
  console.log(`Auth Service running on port ${port}.`)
})

module.exports = app
