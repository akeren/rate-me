const { Response } = require('http-status-codez');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(
        new AppError(
          'Unable to perform operation. Try again!',
          Response.HTTP_BAD_REQUEST
        )
      );
    }

    res.status(Response.HTTP_CREATED).json({
      status: 'success',
      code: res.statusCode,
      message: 'Record created successfully.',
      data: {
        data: doc,
      },
    });
  });
};

module.exports = createOne;
