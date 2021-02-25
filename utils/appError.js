class AppError extends Error {
  constructor (data, statusCode, statusMessage, errors) {
    super(statusMessage)

    this.status_code = statusCode
    this.data = data
    this.status_message = statusMessage
    this.errors = errors

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
