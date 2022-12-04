const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const { NotFoundUser, BadRequestData, ConflictEmail } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)

    .then((user) => {
      if (!user) {
        throw new NotFound(NotFoundUser);
      }
      res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BadRequestData));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound(NotFoundUser);
    })

    .then((user) => {
      res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestData));
        return;
      } if (err.name === 'CastError') {
        next(new BadRequest(BadRequestData));
      } else if (err.code === 11000) {
        next(new Conflict(ConflictEmail));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)

    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))

    .then(() => res.status(200).send({
      data: {
        name,
        email,
      },
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestData));
      } else if (err.code === 11000) {
        next(new Conflict(ConflictEmail));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })

    .catch(next);
};
