const express = require('express');

// 1) Middlewares
const protect = require('../middlewares/protect');
const restrictAccessTo = require('../middlewares/restrictAccessTo');

// 2) Auth Controllers
const signupController = require('../controllers/auth/signup');
const loginController = require('../controllers/auth/login');
const resendTokenController = require('../controllers/auth/resendToken');
const verifyAccountController = require('../controllers/auth/verifyAccount');
const forgotPasswordController = require('../controllers/auth/forgotPassword');
const resetPasswordController = require('../controllers/auth/resetPassword');
const getMeController = require('../controllers/auth/getMe');
const updatePasswordController = require('../controllers/auth/updatePassword');
const updateMeController = require('../controllers/auth/updateMe');
const deleteMeController = require('../controllers/auth/deleteMe');

const adminForgotPasswordController = require('../controllers/auth/adminForgotPassword');
const adminResetPasswordController = require('../controllers/auth/adminResetPassword');

// 3) Administrator Controllers
const getAllUsersController = require('../controllers/user/getAllUsers');
const getUserController = require('../controllers/user/getUser');
const deleteUserController = require('../controllers/user/deleteUser');
const updateUserController = require('../controllers/user/updateUser');

const router = express.Router();

// 4) Auth Routes
router.route('/signup').post(signupController);
router.route('/login').post(loginController);
router.route('/verifyAccount').patch(verifyAccountController);
router.route('/resendToken').patch(resendTokenController);
router.route('/forgotPassword').post(forgotPasswordController);
router.route('/resetPassword').patch(resetPasswordController);

router.route('/forgotPassword').post(adminForgotPasswordController);
router.route('/resetPassword/:token').patch(adminResetPasswordController);

// 4b) User authenticated Routes
router.use(protect);

router.route('/me').get(getMeController, getUserController);
router.route('/upateMyPassword').patch(updatePasswordController);
router.route('/updateMe').patch(updateMeController);
router.route('/deleteMe').delete(deleteMeController);

// 5) Administrator Routes
router.use(restrictAccessTo('admin'));

router.route('/').get(getAllUsersController);
router
  .route('/:id')
  .get(getUserController)
  .patch(updateUserController)
  .delete(deleteUserController);

module.exports = router;
