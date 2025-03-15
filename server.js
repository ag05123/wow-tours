const dotenv=require('dotenv');
dotenv.config({ path : './config.env'});
const mongoose=require('mongoose');

const db=process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);
mongoose.connect(db,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con=>{
    
    console.log('db coneected');
})


const app=require('./app');
// console.log(process.env);
const port = 3000;
app.listen(port, () => {
  
  
});
