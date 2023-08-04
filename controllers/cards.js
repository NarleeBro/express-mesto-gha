const mongoose = require('mongoose');
const Card = require('../models/card');

/* module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.send(data))
        .catch(() => res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена' }));
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
}; */

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch((error) => {
          if (error instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
          } else {
            res.status(500).send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

/* module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res
            .status(404)
            .send({ message: 'Карточка с указанным _id не найдена' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
  } else {
    res.status(400).send({ message: 'Некрректный _id карточки' });
  }
}; */

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => {
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с _id: ${req.params.cardId} не найдена.` });
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

/* module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res
            .status(404)
            .send({ message: 'Карточка с указанным _id не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
  } else {
    res.status(400).send({ message: 'Некрректный _id карточки' });
  }
}; */

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с _id: ${req.params.cardId} не найдена.` });
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

/* module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res
            .status(404)
            .send({ message: 'Карточка с указанным _id не найдена' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(404).send({ message: 'Карточка с указанным _id не найдена' }));
  } else {
    res.status(400).send({ message: 'Некрректный _id карточки' });
  }
}; */

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с _id: ${req.params.cardId} не найдена.` });
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: `Некорректный _id карточки: ${req.params.cardId}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
