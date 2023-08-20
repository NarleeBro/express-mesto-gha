const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => { res.send(user); })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(
          new NotFoundError(
            `Пользователь по указанному _id: ${req.params.userId} не найден.`,
          ),
        );
      } else {
        next(error);
      }
    });
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: 'true', runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(error);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: 'true', runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(error);
      }
    });
};
