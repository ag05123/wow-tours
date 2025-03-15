class apiFeatures{
    constructor(query, QueryString ){
      this.query=query;
      this.QueryString=QueryString;}
      filter(){
        const obj={...this.QueryString};
        const exclude=['sort','page','limit'];
        exclude.forEach(el=> delete obj[el]);
  
        let querystr=JSON.stringify(obj);
        querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
       this.query= this.query.find(JSON.parse(querystr));
        return this;
        
      }
      sorting(){
        
        if(this.QueryString.sort){
          const sortby=this.QueryString.sort.split(',').join(' ');
          this.query=this.query.sort(sortby);
        }else{
          this.query=this.query.sort('-createdAt');
        }
        return this;
      }
      pagination(){
        const page =this.QueryString.page*1 || 1;
        const limit =this.QueryString.limit*1 || 100;
        const skip =(page -1)*limit;
        this.query=this.query.skip(skip).limit(limit);
         
        // if(this.QueryString.page){
        //   const numtour= Tour.countDocuments();
        //   if(skip >= numtour) throw new Error('this page is not exit');
        // }
        return this;
      }
      limiting(){
        if(this.QueryString.fields){
          const fields=this.QueryString.fields.split(',').join(' ');
          this.query=this.query.select(fields);}
        else{
          this.query=this.query.select('-__v');
        }
        return this;
      }
  
    
  }
  module.exports=apiFeatures;