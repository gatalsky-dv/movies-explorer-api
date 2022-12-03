const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');
const { IncorrectEmail, UnAuthorizedEmailPass } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email пользователя'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: IncorrectEmail,
    },
  },

  password: {
    type: String,
    required: [true, 'Пароль пользователя'],
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Имя пользователя'],
  },
});

userSchema.statics.findUserByCredentials = function find(email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(UnAuthorizedEmailPass);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized(UnAuthorizedEmailPass);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
