const { promisify } = require('util');
const { Response } = require('http-status-codez');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please login to get access.',
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        `The user belogging to this token no longer exist.`,
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  if (user.isPasswordChangedAfterTokenWasIssued(decoded.iat)) {
    return next(
      new AppError(
        'You recently changed password! Please login again.',
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  // 5.) GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

module.exports = protect;
