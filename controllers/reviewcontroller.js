const reviews=require('./../models/reviewsmodel');
// const apiFeatures=require('./../utilis/apifeautures');
// const catchAsync = require('../utilis/catchAsync');
const factory =require('./../controllers/handlerFactory');

exports.getAllreviews=factory.getAll(reviews);

exports.setTourUserIds=(req , res ,next) =>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user =req.user.id;
    next();
}

exports.addReview=factory.createOne(reviews);
exports.deletereview=factory.deleteOne(reviews);
exports.updatereview=factory.updateOne(reviews);
exports.getreview=factory.getOne(reviews);