'use strict'

const mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect('mongodb://ram:adminPass!@#@localhost:27017/my_product', { useNewUrlParser: true }).then(() => console.log('DB connection successful!')).throw('Error')
}
