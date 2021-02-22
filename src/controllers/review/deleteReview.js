const Review = require('../../models/reviewModel');
const deleteOne = require('../factory/deleteHandlerFactory');

const deleteReview = deleteOne(Review);

module.exports = deleteReview;
