const { ERR_400 } = require('./errorСodes');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_400;
  }
}

module.exports = BadRequest;
