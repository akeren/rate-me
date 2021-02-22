const { Response } = require('http-status-codez');
const Service = require('../../models/serviceModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// GET /distances / 34, -34 / unit / mi;
const getServiceDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in a format: lat,lng',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  const distances = await Service.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultipler: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(Response.HTTP_OK).json({
    status: 'success',
    code: res.statusCode,
    message: 'Data retrieved successfully',
    data: {
      data: distances,
    },
  });
});

module.exports = getServiceDistances;
