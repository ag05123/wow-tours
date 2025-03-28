const catchAsync = require("../utilis/catchAsync");
const apiFeatures=require('./../utilis/apifeautures');
exports.createOne=Model=>catchAsync(async (req, res) =>{
     
    const doc=await Model.create(req.body);
     res.status(201).json({
       status : "success",
       data :{
         data:doc
       }
     });

});

exports.deleteOne=Model=>catchAsync(async (req , res) =>{
    const doc= await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next (new AppError('No tour found with that id',404));
    }
      res.status(204).json({
        status: 'success',
        data :null
      });
    });

    exports.updateOne= Model =>catchAsync(async (req , res ,next) =>{
        const doc= await Model.findByIdAndUpdate(req.params.id , req.body,{
           new : true,
           runValidators:true
         });
         if(!doc){
           return next(new AppError ('no document found with that id' , 404));
        } 
         res.status(200).json({
           status: 'success',
           data :{
             doc
           }
         });
       
       });

       exports.getOne=(Model , popOptions) =>
        catchAsync(async (req ,res,next)=>{
            let query= Model.findById(req.params.id);
            if(popOptions) query=query.populate(popOptions);
            const doc=await query;

            if(!doc){
                return next(new AppError('No document found with that id ', 404)); 
            }

            res.status(200).json({
                status : 'success',
                data:{
                    data :doc
                }
            });

        }
    
    );
exports.getAll=Model=>catchAsync(async (req, res) => {
    
    let filter={};
    if(req.params.tourId) filter={tour : req.params.tourId}; 
    
    const features=new apiFeatures(Model.find(filter),req.query).filter().sorting().pagination().limiting();
    const doc=await features.query;

    res.status(200).json({
     status : 'success',
     result: doc.length,
     data:{
      data :doc
     }
   
    });
 
});