class ClientError extends Error {
  constructor (message, statusCode = 400, status = 'failed') {
    super(message)
    this.status = status
    this.statusCode = statusCode
    this.name = 'ClientError'
  }
}

module.exports = ClientError
