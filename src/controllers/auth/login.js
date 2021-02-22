const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const createTokenAndSend = require('../../utils/createTokenAndSend');

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Please provide your username and password.',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isValidPassword(password, user.password))) {
    return next(
      new AppError('Invalid login credentials.', Response.HTTP_UNAUTHORIZED)
    );
  }

  if (user.active !== true) {
    return next(
      new AppError(
        'Hello, there! Activate your account first.',
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  createTokenAndSend('Logged in successfully', user, Response.HTTP_OK, res);
});

module.exports = login;
