const { Response } = require('http-status-codez');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError('No record with that ID found.', Response.HTTP_NOT_FOUND)
      );
    }

    res.status(Response.HTTP_OK).json({
      status: 'success',
      code: res.statusCode,
      message: 'Changes made successfully.',
      data: {
        data: doc,
      },
    });
  });
};

module.exports = updateOne;
