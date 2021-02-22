const { Response } = require('http-status-codez');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError('No record with that ID found.', Response.HTTP_NOT_FOUND)
      );
    }

    res.status(Response.HTTP_NO_CONTENT).json({
      status: 'success',
      code: res.statusCode,
      message: 'Deleted successfully.',
      data: null,
    });
  });
};

module.exports = deleteOne;
