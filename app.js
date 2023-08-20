const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;
/* const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env; */

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64e208edd9b924230d5b8d29',
  };

  next();
});

/* app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards")); */
app.use("/", require("./routes/index"));

app.use("*", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT);
