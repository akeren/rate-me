const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const createTokenAndSend = require('../../utils/createTokenAndSend');

const verifyAccount = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(
      new AppError(
        'Provide your username and activation code.',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(
        `You do not have an account on this platform. Proceed to sign up!`,
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  // Check token validity & expiry
  if (
    !(await User.findOne({
      otp,
      otpExpiryTime: { $gt: Date.now() },
    }))
  ) {
    return next(
      new AppError(
        `Token is invalid or has expired!`,
        Response.HTTP_UNAUTHORIZED
      )
    );
  }

  // Update the user's active status to: TRUE
  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { active: true, otp: undefined, otpExpiryTime: undefined },
    { new: true, runValidators: true }
  );

  if (!updateUser) {
    return next(
      new AppError(
        'Unable to activate account. Try again!',
        Response.HTTP_INTERNAL_SERVER_ERROR
      )
    );
  }

  // Response
  createTokenAndSend(
    'Account verified successfully.',
    user,
    Response.HTTP_OK,
    res
  );
});

module.exports = verifyAccount;
