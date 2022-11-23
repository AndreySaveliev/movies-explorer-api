const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/user');
const Error404 = require('./Errors/Error404');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieparser());
mongoose.connect('mongodb://localhost:27017/filmsitedb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post('/signout', (req, res) => {
  res.clearCookie('Bearer');
  res.send({ message: 'Куки удалены' });
});

app.use(auth);
app.use('/user', require('./routes/user'));
app.use('/movie', require('./routes/movie'));

app.use('*', (req, res, next) => {
  next(new Error404('Кажется вы заблудились'));
});

app.use(errorLogger);

app.use(errors);

app.use((err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
});

app.listen(PORT);
