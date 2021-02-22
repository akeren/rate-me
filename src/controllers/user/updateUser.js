const User = require('../../models/userModel');
const updateOne = require('../factory/updateHandlerFactory');

const updateUser = updateOne(User);

module.exports = updateUser;
