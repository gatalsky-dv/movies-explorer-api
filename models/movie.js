const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Страна создания фильма'],
  },
  director: {
    type: String,
    required: [true, 'Режиссёр фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'Длительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'Описание фильма'],
  },
  image: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { required_protocol: true }),
      message: 'Невалидная ссылка',
    },
    required: [true, 'Ссылка на постер к фильму'],
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { required_protocol: true }),
      message: 'Невалидная ссылка',
    },
    required: [true, 'Ссылка на трейлер фильма'],
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => isURL(v, { required_protocol: true }),
      message: 'Невалидная ссылка',
    },
    required: [true, 'Миниатюрное изображение постера к фильму'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'id пользователя'],
    ref: '_id',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'id фильма'],
    ref: 'id',
  },
  nameRU: {
    type: String,
    required: [true, 'Название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Название фильма на английском языке'],
  }
});

module.exports = mongoose.model('movie', movieSchema);