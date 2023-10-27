class Error {
    constructor(error, status, message) {
      this.error = error;
      this.status = status;
      this.message = message;
    }
  }
  
  class Success {
    constructor(error, status, message, data) {
      this.error = error;
      this.status = status;
      this.message = message;
      this.data = data;
    }
  }
  
  module.exports = { Error, Success };