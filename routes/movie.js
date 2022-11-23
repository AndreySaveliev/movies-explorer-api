const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}[a-zA-Z0-9._~:/?#[\]@!$&()*+,;=-]{1,256}$/),
      trailer: Joi.string()
        .required()
        .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}[a-zA-Z0-9._~:/?#[\]@!$&()*+,;=-]{1,256}$/),
      thumbnail: Joi.string()
        .required()
        .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}[a-zA-Z0-9._~:/?#[\]@!$&()*+,;=-]{1,256}$/),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      movieId: Joi.string().required(),
    }),
  }),
  postMovie
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().alphanum().hex(),
    }),
  }),
  deleteMovie
);
module.exports = router;
