const express = require('express');
const reviewRouter = require('./reviewRoutes');

// 1) Middlewares
const protect = require('../middlewares/protect');
const restrictAccessTo = require('../middlewares/restrictAccessTo');
const aliasTopServices = require('../middlewares/aliasTopServices');

// 2) Service Controllers
const getAllServicesController = require('../controllers/service/getAllServices');
const getServiceController = require('../controllers/service/getService');
const getServicesWithinController = require('../controllers/service/servicesWithin');
const getServiceDistancesController = require('../controllers/service/serviceDistances');
const createServiceController = require('../controllers/service/createService');
const deleteServiceController = require('../controllers/service/deleteService');
const updateServiceController = require('../controllers/service/updateService');

const router = express.Router();

// Use reviewRoutes for this very specific route.
router.use('/:serviceId/reviews', reviewRouter);

// 3) Service Routes
router.route('/top-10-cheap').get(aliasTopServices, getAllServicesController);

// Geospatial route
router
  .route('/services-within/:distance/center/:latlng/unit/:unit')
  .get(getServicesWithinController);

router
  .route('/distances/:latlng/unit/:unit')
  .get(getServiceDistancesController);

router
  .route('/')
  .get(getAllServicesController)
  .post(protect, restrictAccessTo('admin', 'client'), createServiceController);
router
  .route('/:id')
  .get(getServiceController)
  .patch(protect, restrictAccessTo('admin', 'client'), updateServiceController)
  .delete(
    protect,
    restrictAccessTo('admin', 'client'),
    deleteServiceController
  );

module.exports = router;
