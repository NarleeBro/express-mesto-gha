const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/testdb' } = process.env;
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
    _id: '64cd37826fd8dd0287c8be73',
  };

  next();
});

app.use('/users', require('./routes/users'));

app.listen(PORT);