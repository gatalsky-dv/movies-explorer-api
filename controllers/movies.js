const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const {
  BadRequestData, NotFoundMovie, DeleteMovie, ForbiddenMovie,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })

    .then((movies) => res.status(200).send(movies))

    .catch(next);
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
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner,
  })

    .then((card) => res.status(200).send({
      data: card,
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BadRequestData));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params.movieId)

    .orFail(() => new NotFound(NotFoundMovie))

    .then((movie) => {
      if (movie.owner.toString() === owner) {
        movie.delete()

          .then(() => res.status(200).send({ message: DeleteMovie }))

          .catch(next);
      } else {
        throw new Forbidden(ForbiddenMovie);
      }
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BadRequestData));
        return;
      }
      next(err);
    });
};
