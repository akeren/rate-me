const Service = require('../../models/serviceModel');
const updateOne = require('../factory/updateHandlerFactory');

const updateService = updateOne(Service);

module.exports = updateService;
