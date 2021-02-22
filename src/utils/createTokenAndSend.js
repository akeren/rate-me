const signToken = require('./signToken');

const createTokenAndSend = (message, user, statusCode, res) => {
  const token = signToken(user._id);

  // SEND TOKEN VIA COOKIE
  const cookieOptions = {
    expires: new Date(
      // Convert expires time to miliseconds
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    code: res.statusCode,
    message,
    data: {
      user,
    },
    token,
  });
};

module.exports = createTokenAndSend;
