const { Response } = require('http-status-codez');
const AppError = require('../utils/appError');

const restrictAccessTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          Response.HTTP_FORBIDDEN
        )
      );
    }

    next();
  };
};

module.exports = restrictAccessTo;
