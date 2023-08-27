const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser } = require('../controllers/users');
const { urlRegular, emailRegular } = require('../utils/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegular),
    email: Joi.string().required().pattern(emailRegular),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), addUser);

module.exports = router;
