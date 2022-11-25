const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})

    .then((movies) => res.send(movies))

    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const { 
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
   } = req.body;

  const ownerId = req.user._id;
  
  Movie.create({ 
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId 
  })

    .then((movie) => {
      if (!movie) {
        next(new BadRequest('Переданны некорректные данные'));
        return;
      }
      res.send(movie);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id: userId } = req.user;

  Movie.findById(req.params.movieId)

    .orFail(() => new NotFound('Карточка не найдена'))

    .then((movie) => {
      if (movie.owner.toString() === userId) {
        movie.delete()

          .then(() => res.status(200).send({ message: 'Успех' }))

          .catch(next);
      } else {
        throw new Forbidden('Запрещено удалять');
      }
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданны некорректные данные'));
        return;
      }
      next(err);
    });
};