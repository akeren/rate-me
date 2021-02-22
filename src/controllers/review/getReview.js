const Review = require('../../models/reviewModel');
const getOne = require('../factory/getHandlerFactory');

const getReview = getOne(Review);

module.exports = getReview;
