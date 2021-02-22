const { Response } = require('http-status-codez');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const filterRquestBodyObject = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

const updateMe = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  // 1) Create an error if POST password data
  if (password || confirmPassword) {
    return next(
      new AppError(
        'This route is not to update password. Please use /updateMyPassword',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated.
  const filteredFields = filterRquestBodyObject(
    req.body,
    'firstName',
    'lastName',
    'phone',
    'photo'
  );

  // 3) Update User document
  const user = await User.findByIdAndUpdate(req.user.id, filteredFields, {
    new: true,
    runValidators: true,
  });

  res.status(Response.HTTP_OK).json({
    status: 'success',
    code: res.statusCode,
    message: 'Changes made successfully.',
    data: {
      user,
    },
  });
});

module.exports = updateMe;
