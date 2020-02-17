class CustomError extends Error {
  status
  message
  constructor(status, msg) {
    super(msg)
    this.status = status
    this.message = msg
  }
}

module.exports = CustomError
