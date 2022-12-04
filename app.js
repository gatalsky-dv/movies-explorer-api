require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('./middlewares/cors');
const errorHandl = require('./middlewares/errorHandl');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, NODE_ENV, DATABASES } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(NODE_ENV === 'production' ? DATABASES : 'mongodb://localhost:27017/moviesdb');

app.use(cors);

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.use(helmet());

app.use('/', require('./routes'));

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandl);

app.listen(PORT);
