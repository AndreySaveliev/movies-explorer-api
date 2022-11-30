const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getMe, changeUserInfo } = require('../controllers/user');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), changeUserInfo);

module.exports = router;
