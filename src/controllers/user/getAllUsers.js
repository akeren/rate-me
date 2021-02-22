const User = require('../../models/userModel');
const getAll = require('../factory/getAllHandlerFactory');

const getAllUsers = getAll(User);

module.exports = getAllUsers;
