const { Response } = require('http-status-codez');
const Service = require('../../models/serviceModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// GET /services-within/:distance/center/:latlng/unit/:unit
const getServicesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in a format: lat,lng',
        Response.HTTP_BAD_REQUEST
      )
    );
  }

  const services = await Service.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(Response.HTTP_OK).json({
    status: 'success',
    code: res.statusCode,
    message: 'Data retrieved successfully.',
    results: services.length,
    data: {
      data: services,
    },
  });
});

module.exports = getServicesWithin;
