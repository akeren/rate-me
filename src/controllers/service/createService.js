const Service = require('../../models/serviceModel');
const createOne = require('../factory/createHandlerFactory');

const createService = createOne(Service);

module.exports = createService;
