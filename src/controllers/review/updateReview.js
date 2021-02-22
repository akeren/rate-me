const Review = require('../../models/reviewModel');
const updateOne = require('../factory/updateHandlerFactory');

const updateReview = updateOne(Review);

module.exports = updateReview;
