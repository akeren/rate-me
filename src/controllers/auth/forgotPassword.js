const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendEmail = require('../../utils/email');
const sendSMS = require('../../utils/sms');

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

  // 1) Get user based on POSTed email
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(
        `There's no user associated with that email. Proceed to signup!`,
        Response.HTTP_NOT_FOUND
      )
    );
  }

  // 2) Create reset token for the user
  const token = user.createMobileToken();
  if (!(await user.save({ validateBeforeSave: false }))) {
    return next(
      new AppError(
        'Unable to process request. Try again!',
        Response.HTTP_INTERNAL_SERVER_ERROR
      )
    );
  }

  // 3) Send token via email & sms
  const emailMessage = `Forgot your password? use this reset code: ${token}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendSMS(
      `Hi, ${user.firstName}! Here is your reset code: ${token}`,
      user.phone
    );
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message: emailMessage,
    });

    sendSuccessMessage(
      'Reset Token sent. Check your phone or email!',
      Response.HTTP_OK,
      res
    );
  } catch (err) {
    user.token = undefined;
    user.tokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return new AppError(
      'There was a error sending the token. Try again later!',
      500
    );
  }
});

module.exports = forgotPassword;
