const User = require('../../models/userModel');
const getOne = require('../factory/getHandlerFactory');

const getUser = getOne(User);

module.exports = getUser;
