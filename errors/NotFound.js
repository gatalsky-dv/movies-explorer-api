const { ERR_404 } = require('./errorСodes');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_404;
  }
}

module.exports = NotFound;
