const { Response } = require('http-status-codez');
const crypto = require('crypto');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const createTokenAndSend = require('../../utils/createTokenAndSend');

const resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(
      new AppError('Enter your new password.', Response.HTTP_BAD_REQUEST)
    );
  }

  const incomingHashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: incomingHashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createTokenAndSend(
    'Password reset successfully.',
    user,
    Response.HTTP_OK,
    res
  );
});

module.exports = resetPassword;
