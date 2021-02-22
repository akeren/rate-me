const Service = require('../../models/serviceModel');
const getAll = require('../factory/getAllHandlerFactory');

const getAllServices = getAll(Service);

module.exports = getAllServices;
