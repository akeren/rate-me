const Service = require('../../models/serviceModel');
const deleteOne = require('../factory/deleteHandlerFactory');

const deleteService = deleteOne(Service);

module.exports = deleteService;
