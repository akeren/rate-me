const Review = require('../../models/reviewModel');
const createOne = require('../factory/createHandlerFactory');

const createReview = createOne(Review);

module.exports = createReview;
