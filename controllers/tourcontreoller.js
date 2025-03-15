const multer = require ('multer');
const catchAsync=require('./../utilis/catchAsync');

const sharp=require ('sharp');
const AppError = require('../utilis/appError');
const Tour=require('./../models/tourmodel')
const factory =require('./../controllers/handlerFactory');
const multerStorage=multer.memoryStorage();
const multerFilter=(req , file , cb) =>{
  if(file.mimetype.startsWith('image')){
    cb(null , true)
  } else {
    cb(new AppError('not an image please upload only image',400), false)
  }
}

const upload = multer({
  storage : multerStorage,
  fileFilter : multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.toptour =  (req, res, next) =>{
  req.query.limit = '1';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};
exports.getToursbyid=factory.getOne(Tour , {path : 'reviews'});

exports.updatetour=factory.updateOne(Tour);

exports.deletetour=factory.deleteOne(Tour);

exports.getTours=factory.getAll(Tour);

exports.addTours=factory.createOne(Tour);


exports.getTourStats= async (req,res)=>{
  try{
    const stats=await Tour.aggregate([
      {
        $match : {ratingsAverage : {$gte : 4.5}}
      },
      {
        $group : {
          _id:'$difficulty',
          numTours :{$sum : 1},
          numRatings :{$sum : '$ratingsQuantity'},
          avgRating :{$avg : 'ratingsAverage'},
          avgPrice :{$avg  : '$price'},
          minPrice :{$min : '$price'},
          maxPrice : {$max : '$price'}
        }
      }
    ]);
    res.status(201).json({
      status : "success",
      data :{
        stats
      }
    });

  }catch(err){
    res.status(400).json({
      status: 'faileddd',
      message: err
     });
  }
}

exports.getMonthlyplan=async (req,res) =>{
  try{
        const year=req.params.year * 1;
        const plan= await Tour.aggregate([
          {
            $unwind : '$startDates'
          },
          {
            $match : {
              startDates :{
                $gte : new Date(`${year}-01-01`),
                $lte : new Date(`${year}-12-31`),
              }
            }
          },
          {
            $group:{
              _id:{$month:'$startDates'},
              numTourStarts:{$sum :1},
              tours:{$push:'$name'}
            }
          },
          {
            $addFields :{month:'$_id'}
          },
          
          {
            $project:{
              _id:0
            }
          },
          
          {
            $sort : {numTourStarts:-1}
          },
          {
            $limit :12
          }

        ]);

    res.status(201).json({
      status : "success",
      data :{
        plan
      }});
  }catch(err){
    res.status(400).json({
      status: 'faileddd',
      message: err
     });
  }
}

exports.getTourWithin = async (req, res, next) => {
  try {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',').map(coord => parseFloat(coord.trim()));


    if (isNaN(lat) || isNaN(lng)) {
      return next(new AppError('Please provide valid latitude and longitude in the format lat,lng', 400));
    }

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    console.log(distance, lat, lng, unit);

    const tours = await Tour.find({
      startLocation: { 
        $geoWithin: { 
          $centerSphere: [[lng, lat], radius] 
        } 
      }
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours
      }
    });
  } catch (err) {
    next(err);
  }
};














































































































































































































































































































































































































































































































  
  