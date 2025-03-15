const mongoose = require('mongoose');
// const User = require('./usermodel');
// const slugify = require('slugify');
const reviews = require('./../models/reviewsmodel');
const { default: slugify } = require('slugify');
const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'a tour have name'],
      trim: true,
      maxlength: [40, 'a tour must have less or equal to 40 characters'],
      minlength: [10, 'a tour must have greater or equal to 10 characters'],
    },
    slug : String,
    duration: {
      type: Number,
      required: [true, 'a tour have duration'],
    },
    rating: {
      default: 4.5,
      type: Number,
      min: [1, 'must have 1'],
      max: [5, 'must have less than 5'],
    },

    price: {
      type: Number,
      required: [true, 'a tour have price'],
    },
    pricediscount: {
      // only work while creating new
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'a tour have ({VALUE})discount less than price',
      },
    },
    difficulty: {
      type: String,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      default: 25,
    },

    summary: {
      type: String,
      trim: true,
      default: 'iuad iabivs sivi jvsndvins vsin ivxdn kdoidnx sidx os dcoc',
    },
    description: {
      type: String,
      trim: true,
      // required:[true,'a tour have name']
    },
    imageCover: {
      type: String,
      // required:[true,"a tour must have cover"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: 
      {
        type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
   
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourschema.index({price : 1});
tourschema.index({startLocation : '2dsphere'});
tourschema.virtual('reviews', {
  ref: 'reviews',
  foreignField: 'tour',
  localField: '_id',
  
});

tourschema.virtual('durationWeeks').get(function (){
  return this.duration/7;
} );

tourschema.pre('save' , function (next){
  this.slug = slugify(this.name,{lower : true , strict: true });
  next();
});


// tourschema.pre('save' , async function(next){
//     try{const guidePromises=this.guides.map(async id => await User.findById(id));
//     this.guides=await Promise.all(guidePromises);
//     next();}catch(err){
//         console.log(err);
//     }
// });
tourschema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
const Tour = mongoose.model('Tour', tourschema);
module.exports = Tour;
