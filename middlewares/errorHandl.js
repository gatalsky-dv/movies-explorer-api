const { ERR_500 } = require('../errors/errorСodes');
const { ServerError } = require('../utils/constants');

const errorHandl = (err, req, res, next) => {
  const { statusCode = ERR_500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === ERR_500 ? ServerError : message });
  next();
};

module.exports = errorHandl;
