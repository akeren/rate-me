const User = require('../../models/userModel');
const deleteOne = require('../factory/deleteHandlerFactory');

const deleteUser = deleteOne(User);

module.exports = deleteUser;
