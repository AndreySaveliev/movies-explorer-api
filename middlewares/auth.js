const jwt = require('jsonwebtoken');
const Error401 = require('../Errors/Error401');

const { JWT_SECRET = 'MOVIE' } = process.env;

module.exports = (req, res, next) => {
  const cookie = req.cookies.Bearer;
  if (!cookie) {
    throw new Error401('Необходимо авторизоироваться');
  }
  const token = cookie.replace('Bearer=', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error401('Необходимо авторизироваться');
  }
  req.user = payload;
  next();
};
