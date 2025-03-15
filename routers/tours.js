const express = require('express');
const reviewRouter=require('../routers/reviews');
const tourcontrollers=require('.././controllers/tourcontreoller');
const authController=require('.././controllers/authentication');
const router=express.Router();

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourcontrollers.getTourWithin);

router.use('/:tourId/reviews' , reviewRouter);
router.route('/plan-month/:year').get(authController.protect ,authController.restrictTo('admin' , 'lead-guide') ,tourcontrollers.getMonthlyplan);
router.route('/tour-stats').get(tourcontrollers.getTourStats);
router.route('/top-5-tours').get( tourcontrollers.toptour,tourcontrollers.getTours);
router.route('/').get(tourcontrollers.getTours).post(authController.protect ,authController.restrictTo('admin' , 'lead-guide'),tourcontrollers.addTours);
router.route('/:id').get(tourcontrollers.getToursbyid ).patch(tourcontrollers.uploadTourImages,tourcontrollers.resizeTourImages,authController.protect ,authController.restrictTo('admin' , 'lead-guide') ,tourcontrollers.updatetour).delete(authController.protect, authController.restrictTo('admin' , 'lead-guide') ,tourcontrollers.deletetour);
// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'),reviewcontroller.addReview);
module.exports=router;