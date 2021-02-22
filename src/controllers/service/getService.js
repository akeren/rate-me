const Service = require('../../models/serviceModel');
const getOne = require('../factory/getHandlerFactory');

const getService = getOne(Service, { path: 'reviews' });

module.exports = getService;
