const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../Errors/Error400');
const Error401 = require('../Errors/Error401');
const Error404 = require('../Errors/Error404');
const Error409 = require('../Errors/Error409');
require('dotenv').config();

const { JWT_SECRET = 'MOVIE' } = process.env;

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.fingById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new Error404('Указаный пользователь не найдей');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Передан не корректное значение id'));
      } else {
        next(err);
      }
    });
};

const changeUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new Error404('Указаный пользователь не найдей');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new Error400('Переданы не корректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, password, email } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      password: hash,
      email,
    }).then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      });
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Error409('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new Error400('Переданы не коректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user === null) {
        throw new Error401('Неправильная почта или пароль');
      }
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error401('Неправильная почта или пароль');
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.cookie('Bearer', token, {
          maxAge: 3600 * 27 * 7,
          httpOnly: true,
        });
        return res.send({ data: user });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMe,
  changeUserInfo,
  createUser,
  login,
};
