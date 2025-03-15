const AppError = require('../utilis/appError');
const User=require('./../models/usermodel');
const catchAsync=require('./../utilis/catchAsync');
const factory =require('./../controllers/handlerFactory');
const multer = require ('multer');
const sharp=require ('sharp');
// const multerStorage=multer.diskStorage({
//   destination : (req , file ,cb)=>{
//     cb(null , 'public/img/users');
//   },
//   filename:(req , file, cb) =>{
//     console.log(req.user.id);
//     const ext = file.mimetype.split('/')[1];
//     cb(null , `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
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

exports.uploadUserPhoto=upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterobj =(obj , ...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el =>{
    if(allowedFields.includes(el)) newObj[el]=obj[el];
    
  });
  return newObj;
}

exports.getMe=(req , res , next) =>{
  req.params.id=req.user.id;
  next();
}

exports.updateMe=catchAsync(async(req, res,next)=>{
  
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError ('this is not for updating pass using /upadtePassword',400));
  }
  const filterBody=filterobj(req.body , 'name', 'email');
  if(req.file) filterBody.photo=req.file.filename;
   const upadtedUser=await User.findByIdAndUpdate(req.user.id ,filterBody,{
    new: true ,
    runValidators :true
   });

  res.status(200).json({
    status : 'success',
    data:{
      user : upadtedUser
    }
  });
});

exports.deleteMe=catchAsync(async(req , res ,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active : false});

res.status(204).json({
  status : 'success',
  data : null
});


});
exports.getAllUsers=catchAsync(async(req , res , next)=>{
  const users=await User.find();

  res.status(200).json({
    status : 'success',
    result: users.length,
    data:{
     users
    }
  
   });
  });
  exports.getUser=factory.getOne(User);
  exports.deleteUser=factory.deleteOne(User);
  exports.updateUser=factory.updateOne(User);
 
  
   


 
