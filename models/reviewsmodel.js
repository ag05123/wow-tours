const mongoose = require('mongoose');
const tour = require('./tourmodel');
const reviewSchema = new mongoose.Schema({
    tour:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Tour',
            required:[true , 'review must have to atour']
        }
    ] ,
    user:
            {
                type : mongoose.Schema.ObjectId,
                ref:'User',
                required:[true , 'review must have to a user']
            }
        ,
    review:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
        default :4,
        min: [1, 'must have 1'],
        max: [5, 'must have less than 5']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({tour : 1, user :1} , {unique : true});

reviewSchema.statics.calcAverageRatings=async function(tourId){
    const stats=await  this.aggregate([
        {
            $match : {tour : tourId}
        },
        {
            $group : {
                _id : '$tour',
                nRating:{$sum :1},
                avgRating:{$avg : '$ratings'}
            }
        }
    ]);
    // console.log(stats);
     if(stats){
    await tour.findByIdAndUpdate(tourId , {
        ratingsQuantity : stats[0].nRating,
        ratingsAverage :stats[0].avgRating
    });}
    else{
        await tour.findByIdAndUpdate(tourId , {
            ratingsQuantity : 0,
            ratingsAverage :0
        });
    }
}

reviewSchema.post('save' , function (){
    this.constructor.calcAverageRatings(this.tour);
    
});

reviewSchema.pre(/^findOneAnd/ , async function(next){
    this.r=await this.findOne();
    next();
});
reviewSchema.post(/^findOneAnd/ , async function(){
    await this.r.constructor.calcAverageRatings(this.r.tour);
});


// reviewSchema.pre(/^find/, function(next){
//   this.populate({
//         path:'user',
//         select : 'name photo'
//     });
//     next();
// });

  
const reviews=mongoose.model('reviews' , reviewSchema);
module.exports=reviews;