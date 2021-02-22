const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  if (!user) {
    return next(
      new AppError(
        'Unable to delete account.',
        Response.HTTP_INTERNAL_SERVER_ERROR
      )
    );
  }

  res.status(Response.HTTP_NO_CONTENT).json({
    status: 'success',
    code: res.statusCode,
    message: 'Account deleted successfully.',
    data: null,
  });
});

module.exports = deleteMe;
