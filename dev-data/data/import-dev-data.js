const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('../../models/tourmodel');



const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((con) => {
    console.log('db coneected successfully');
  });

  const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json', 'utf-8'));

const addall = async () => {
  try {
    await Tour.create(tours);
   
    console.log('data successfully fetched');
    
  } catch(err) {
    console.log(err);
  }
  process.exit();
};
const deleteall = async () => {
  try {
    await Tour.deleteMany();
   
    console.log('data has deleted');
  } catch (err){
    console.log(err);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  addall();
} else {
  if (process.argv[2] === '--delete') {
    deleteall();
  }
}
