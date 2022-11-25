const Error404 = require('../Errors/Error404');
const Error403 = require('../Errors/Error403');
const Error401 = require('../Errors/Error401');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((err) => {
      next(err);
    });
};

const postMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie === null) {
        throw new Error404('Фильм не найдена');
      }
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne().then(res.send({ data: movie })).catch((err) => next(err));
      } else {
        throw new Error403('Вы не можете удалять фильмы других пользователей');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error401('Переданы не коректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
