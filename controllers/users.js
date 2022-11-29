const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserMe = async (req, res, next) => {
  User.findById(req.user._id)

    .then((user) => {
      if (!user._id) {
        throw new NotFound('Пользователь не найден');
      }
      res.send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданны некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => { throw new BadRequest('Переданны некорректные данные'); })

    .then((user) => {
      if (!user) {
        throw new BadRequest('Переданны некорректные данные');
      }
      res.send(user);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = async (req, res, next) => {
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

    .then(() => res.send({
      data: {
        name,
        email,
      },
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)

    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })

    .catch(next);
};
