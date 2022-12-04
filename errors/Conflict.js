const { ERR_409 } = require('./errorСodes');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_409;
  }
}

module.exports = Conflict;
