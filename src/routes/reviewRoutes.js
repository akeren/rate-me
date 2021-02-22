const express = require('express');

// 1) Middlewares
const protect = require('../middlewares/protect');
const setUserAndServiceIds = require('../middlewares/setUserAndServiceIds');
const restrictAccessTo = require('../middlewares/restrictAccessTo');

// 2) Review Controllers
const getAllReviewsController = require('../controllers/review/getAllReviews');
const getReviewController = require('../controllers/review/getReview');
const createReviewController = require('../controllers/review/createReview');
const deleteReviewController = require('../controllers/review/deleteReview');
const updateReviewController = require('../controllers/review/updateReview');

const router = express.Router({ mergeParams: true });

// 3) Review Routes
router.use(protect);

router
  .route('/')
  .get(getAllReviewsController)
  .post(restrictAccessTo('user'), setUserAndServiceIds, createReviewController);
router
  .route('/:id')
  .get(getReviewController)
  .patch(restrictAccessTo('admin', 'user'), updateReviewController)
  .delete(restrictAccessTo('admin', 'user'), deleteReviewController);

module.exports = router;
