class CustomError extends Error {
  constructor(status, msg) {
    super(msg)
    this.status = status
    this.message = msg
  }
}

export default CustomError
