const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/email');

const sendSuccessMessage = (message, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    code: res.statusCode,
    message,
  });
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new AppError(
        'Please provide your email address.',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(
        `There's no user associated with that email.`,
        Response.HTTP_NOT_FOUND
      )
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Click this link: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });
    sendSuccessMessage('Token sent to your email!', Response.HTTP_OK, res);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return new AppError(
      'There was a error sending the email. Try again later!',
      500
    );
  }
});

module.exports = forgotPassword;
