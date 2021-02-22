const { Response } = require('http-status-codez');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const getOne = (Model, populateOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(
        new AppError('No record with that ID found.', Response.HTTP_NOT_FOUND)
      );
    }

    res.status(Response.HTTP_OK).json({
      status: 'success',
      code: res.statusCode,
      message: 'Data retrieved successfully',
      data: {
        data: doc,
      },
    });
  });
};

module.exports = getOne;
