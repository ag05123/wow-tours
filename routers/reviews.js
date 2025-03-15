const express = require('express');
const authController=require('.././controllers/authentication');
const reviewcontroller=require('../controllers/reviewcontroller');
const router=express.Router({mergeParams:true});

router.use(authController.protect);

router.route('/:id').delete(authController.restrictTo('user' , 'admin'),reviewcontroller.deletereview ).patch(authController.restrictTo('user' , 'admin'),reviewcontroller.updatereview).get(reviewcontroller.getreview);
router.route('/').post(authController.restrictTo('user') , reviewcontroller.setTourUserIds ,reviewcontroller.addReview );
router.route('/').get(reviewcontroller.getAllreviews);
module.exports=router;