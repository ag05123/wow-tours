const express = require('express');
const app = express();
const cors = require('cors');
const compression=require('compression');
const path =require('path');
const helmet=require('helmet');
const hpp=require('hpp');
const rateLimit=require('express-rate-limit');
const morgan=require('morgan');
const tourRouters=require('./routers/tours');
const userRouters=require('./routers/user');
const reviewsRouters=require('./routers/reviews');
const monoSanitize = require('express-mongo-sanitize');
const xss=require('xss-clean');
const cookieParser = require('cookie-parser');
const viewRouter = require('./routers/viewrouter');
// setting headers
app.set('view engine' , 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*" , cors());

app.use(express.static(path.join(__dirname , 'public')));
 app.use(helmet());

// development logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
// limiting requeest
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'too many request please try again after an hour'
});
app.use('/api' , limiter);

// body parser , raeding data from  body into req.body
app.use(express.json({limit : '10kb'}));
app.use(cookieParser());


app.use((req , res , next) =>{
    console.log(req.cookies);
    next();
});

// app.use((req, res, next) => {
//     res.locals.user = req.user || null; // This makes `user` available in Pug templates
//     next();
//   });
  
// nosql query injection  data senitization
app.use(monoSanitize());

// data sanitization

app.use(xss());
// prevent parameter pollution
app.use(hpp({
    whitelist : [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'

    
    ]
}));



app.use(morgan('dev'));



app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users',userRouters);
app.use('/api/v1/reviews',reviewsRouters);
 module.exports=app;
