const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const createTokenAndSend = require('../../utils/createTokenAndSend');

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.isValidPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  createTokenAndSend(
    'Password changed successfully.',
    user,
    Response.HTTP_OK,
    res
  );
});

module.exports = updatePassword;
