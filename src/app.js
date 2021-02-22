const express = require('express');
const morgan = require('morgan');
const { Response } = require('http-status-codez');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

/*
 ** USER-DEFINE IMPORTS
 */
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

/*
 ** GLOBAL MIDDLEWARE
 */

// Set HTTP security headers
app.use(helmet());

// Development logging using morgan
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit the number of requests allowed from thesame IP address in hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, try again in an hour!',
});
app.use('/api/', limiter);

// Body parser, reading data from the req.body
app.use(express.json());

// Data sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['ratingsQuantity', 'ratingsAverage', 'price'],
  })
);

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/services', serviceRouter);
app.use('/api/v1/reviews', reviewRouter);

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this Server!`,
      Response.HTTP_NOT_FOUND
    )
  );
});

// GLOBAL ERORR HANDLER
app.use(globalErrorHandler);

module.exports = app;
