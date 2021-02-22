const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const createTokenAndSend = require('../../utils/createTokenAndSend');

const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;

  if (!password || !confirmPassword || !token) {
    return next(
      new AppError('Enter your new password.', Response.HTTP_BAD_REQUEST)
    );
  }

  // GRAB THE USER USING THE TOKEN AND CHECK IF THE TOKEN HAS EXPIRED
  const user = await User.findOne({
    token,
    tokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.token = undefined;
  user.tokenExpires = undefined;

  if (!(await user.save())) {
    return next(
      new AppError(
        'Unable to reset passsword. Try again!',
        Response.HTTP_INTERNAL_SERVER_ERROR
      )
    );
  }

  // Response
  createTokenAndSend(
    'Password reset successfully.',
    user,
    Response.HTTP_OK,
    res
  );
});

module.exports = resetPassword;
