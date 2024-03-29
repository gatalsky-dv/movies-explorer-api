const { celebrate, Joi } = require('celebrate');
const { UrlDead } = require('../utils/constants');

const validationURL = (value, helpers) => {
  const regex = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

  if (!regex.test(value)) {
    return helpers.error(UrlDead);
  }
  return value;
};

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // email: Joi.string().required().email(),
    email: Joi.string().required(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationURL),
    trailerLink: Joi.string().required().custom(validationURL),
    thumbnail: Joi.string().required().custom(validationURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    // movieId: Joi.number().required().length(24).hex(),
    movieId: Joi.string().length(24).hex().required(),
    // movieId: Joi.number().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    // email: Joi.string().required().email(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  updateUserValidation,
  createMovieValidation,
  movieIdValidation,
  loginValidation,
  createUserValidation,
};
