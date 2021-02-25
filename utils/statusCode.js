'use strict'

const getStatusCode = (status) => {
    if (status && status.includes('_')) {
        status = status.split('_')
        return status[status.length - 1]
    }
    return status
}

module.exports = {
  getStatusCode
}