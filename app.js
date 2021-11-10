const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const sendResponse = require('./helpers/sendResponse');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Mongo Connection
require('./mongoConfig');

app.use('/api', indexRouter);

/** when request match no ruote, create error */
app.use((req, res, next) => {
  const error = new Error('Wrong url');
  error.statusCode = 404;
  next(error);
});

/** when next(error) called,
 * this function will send error message */
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return sendResponse(res, err.statusCode, false, null, true, 'Url not found');
  } else {
    return sendResponse(res, 500, false, null, err.message, 'Internal Server Error');
  }
});

module.exports = app;
