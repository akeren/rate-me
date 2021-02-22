const { Response } = require('http-status-codez');
const catchAsync = require('../../utils/catchAsync');
const APIQueryFeatures = require('../../utils/apiQueryFeatures');

const getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.serviceId) filter = { service: req.params.serviceId };

    const queryFeatures = new APIQueryFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await queryFeatures.query;

    res.status(Response.HTTP_OK).json({
      status: 'success',
      code: res.statusCode,
      results: doc.length,
      message: 'Data retrieved successfully',
      data: {
        data: doc,
      },
    });
  });
};

module.exports = getAll;
