const express = require('express');
const multer=require('multer');
const usercontrollers=require('./../controllers/userscontroller');
const authentication=require('./../controllers/authentication');
const uplaod =multer({dest : 'public/img/users'}) 
const router=express.Router();
  router.post('/signup',authentication.signup);
  router.post('/login',authentication.login);
  router.get('/logout',authentication.logout);
  router.post('/forgotPassword',authentication.forgotPassword);
  router.patch('/resetPassword/:token',authentication.resetPassword);

  router.use(authentication.protect);
 router.route('/me').get(  usercontrollers.getMe , usercontrollers.getUser); 
  router.delete('/deleteMe' ,usercontrollers.deleteMe );
  router.patch('/updateMe' ,usercontrollers.uploadUserPhoto , usercontrollers.resizeUserPhoto,usercontrollers.updateMe );
  router.patch('/updateMyPassword' , authentication.updatePassword);
  
  router.use(authentication.restrictTo('admin'));
  
  router.route('/').get(usercontrollers.getAllUsers);
  router.route('/:id').delete(usercontrollers.deleteUser).patch(usercontrollers.updateUser).get(usercontrollers.getUser);
  module.exports=router;