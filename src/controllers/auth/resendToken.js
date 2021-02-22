const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendSMS = require('../../utils/sms');
const sendEmail = require('../../utils/email');

const resendToken = catchAsync(async (req, res, next) => {
  //1) Grab the user from the DB
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(
        `You don't have an account on this platform. Proceed to sign up!`,
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  const token = user.generate4DigitOTP();

  // 2) Update the user's token in the DB
  if (!(await user.save({ validateBeforeSave: false }))) {
    return next(
      new AppError(
        'Unable to process resend token. Try again!',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  // 3) Send the new auth token via phone & email
  const message = `Hello ${user.firstName}! Sorry for what happened the first time. Here is the new token: ${token}`;

  try {
    await sendSMS(message, user.phone);

    await sendEmail({
      email: user.email,
      subject: 'New Resend Token (valid for 10 minutes)',
      message,
    });

    res.status(Response.HTTP_OK).json({
      status: 'success',
      code: res.statusCode,
      message: 'Token resent successfully',
    });
  } catch (error) {
    return next(
      new AppError(
        'There was a error sending the token. Try again!',
        Response.HTTP_INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = resendToken;
