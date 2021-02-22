const Review = require('../../models/reviewModel');
const getAll = require('../factory/getAllHandlerFactory');

const getAllReviews = getAll(Review);

module.exports = getAllReviews;
