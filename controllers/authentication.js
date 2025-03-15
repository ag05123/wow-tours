const crypto=require('crypto');
const {promisify} =require('util');
const jwt=require ('jsonwebtoken');
const User=require('./../models/usermodel');
const catchAsync=require('./../utilis/catchAsync');
const AppError= require('./../utilis/appError');
const sendEmail=require ('./../utilis/email');
 const signToken=id=>{
    return jwt.sign({id} , process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN});
 }

 const createSendToken=(user , statusCode , res) =>{
    const token= signToken(user._id);
    const cookieOptions={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        secure :true,
        httpOnly :true
    };
    if(process.env.NODE_ENV ==='production') cookieOptions.secure=true;
    user.password=undefined;
    res.cookie('jwt' , token, cookieOptions);
    res.status(statusCode).json({
        status : 'success',
        token,
        data:{
            user
        }
        
    });


 }
exports.signup=catchAsync(async(req,res,next)=>{
    const newUser =await User.create(req.body
        // name: req.body.name,
        // email:req.body.email,
        // password:req.body.password,
        // passwordConfirm:req.body.passwordConfirm,
        // role : req.body.role,
        // passwordChangeAt:req.body. passwordChangeAt
    );
    createSendToken(newUser , 201 ,res);
        

    });
exports.login=catchAsync(async(req , res , next) =>{
    const {email,password}=req.body;
// 1st step heck email and pass exitc
    if(!email || !password){
        return next(new AppError('Please provide email ans pass',400));
        
    }

// 2nd is it vaild
const user=await User.findOne({email}).select('+password');
if(!user || !( await user.correctPassword(password , user.password))){
    return next(new AppError('Incorret pass or mail' , 401));
}

// 3rd token send to client
createSendToken(user , 200 ,res);

});
exports.protect=catchAsync(async(req, res, next)=>{
// 1get token and check its there
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token=req.headers.authorization.split(' ')[1];
}
if (!token && req.cookies.jwt) {
    token = req.cookies.jwt;
}
console.log(token);
if(!token){
    return next(new AppError('You are not logged in to get access',401));
}
// 2verification
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
// console.log(decoded);
// check still user exit
const currentuser=await User.findById(decoded.id);
if(!currentuser){
    return next(new AppError('The user beloginng to this token is no longer exit',401));}
// 4 checkk if pass is change

if(currentuser.chnagePasswordAfter(decoded.iat)){
    return next( new AppError('User recentyl changed',401));
}
req.user=currentuser;
res.locals.user = currentuser;
    next();
});

exports.isLoggedIn = async (req, res, next) => {
    
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
        // 2) Check if user still exists
        const currentuser = await User.findById(decoded.id);
        
        if (!currentuser) {
          return next();
        }
  
        // 3) Check if user changed password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //   return next();
        // }
  
        // THERE IS A LOGGED IN USER
        
        res.locals.user = currentuser;
        
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

exports.logout = (req, res) => {
    res.cookie('jwt', 'logoutjg', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  };
exports.restrictTo=(...roles) =>{
    return (req , res , next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('you dont have permission to perform this actiomn', 403))
        }
        next();
    }
}
exports.forgotPassword= catchAsync (async(req , res , next)=> {
    // get user thorugh mail
    const user =await User.findOne({email : req.body.email});
    if(!user){
        return next(new AppError('there is no user with email',404));
    }
    // token generate random
    const resetToken=user.createpasswordresetToken();
    await user.save({validateBeforeSave : false});
    // send to mail

    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `forgot your password? Submit a patch rqe with your new pass and passwordconfirm to : ${resetURL}.\n`;
    try{
    await sendEmail({
        email : user.email,
        subject:'your password reset token (vaild for 10min)',
        message
    });
    res.status(200).json({
        status : 'success',
        message: 'Token sent to email'
    });
}catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save({validateBeforeSave : false});

    return next (new AppError('there was an error sending the email try again later', 500));
}
});
exports.resetPassword=catchAsync(async(req , res , next)=> {
    // 1 get user baased on the token
    
    const hashtoken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user =await User.findOne({passwordResetToken : hashtoken , passwordResetExpires :{$gt : Date.now()}});

    // 2 if token has no expired and there is user set the password
     
    if(!user){
        return next(new AppError('Token is inavalid or has expired' , 400));
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    // 3 update changepassat for user 

    // 4 log in the user send JWT
    createSendToken(user , 200 ,res);
});

exports.updatePassword=catchAsync(async(req,  res ,next) =>{
    // 1 get user from collection
    const user=await User.findById(req.user.id).select('+password');
    //2check if current pass is correct 
    if(!(await user.correctPassword(req.body.passwordCurrent , user.password))){
        return next(new AppError ('your current pass is Wrong ', 401));
    }

    //3 if so update pass
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
    createSendToken(user , 201 ,res);
    //4 log user in send jwt 
});