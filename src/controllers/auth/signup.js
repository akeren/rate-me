const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendSMS = require('../../utils/sms');

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  if (!user) {
    return next(
      new AppError('Unable to create account.', Response.HTTP_BAD_REQUEST)
    );
  }
  const token = user.generate4DigitOTP();
  await user.save({ validateBeforeSave: false });

  const message = `Hello, ${user.firstName}! Here is your account activation code: ${token}`;

  await sendSMS(message, user.phone);

  res.status(Response.HTTP_CREATED).json({
    status: 'success',
    code: res.statusCode,
    message: 'Success. Check your phone or email!',
    data: {
      user,
    },
  });
});

module.exports = signup;
