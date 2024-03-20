class apifeatures{
    constructor(querying,querystr){
      this.querying= querying;
      this.querystr=querystr;
    }
    filter(){
      // ?salary[gte]=35
          // Greater than or lesserthan or equal to
          const excludefields=['page','limit','fields','sort'];
          const objquery={...this.querystr};
          excludefields.forEach((el)=>{
               delete objquery[el]
           })
          let querystring = JSON.stringify(objquery);
          console.log("in filter")
          querystring=querystring.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
          const queryobj= JSON.parse(querystring)
          this.querying=this.querying.find(queryobj)
          return this;
    }
     sort(){
      console.log("sorting")
         if(this.querystr.sort){
        // this.querying= this.querying.sort(this.querystr.sort)
        const sortby=this.querystr.sort.split(',').join('');
        console.log(sortby)
        this.querying=this.querying.sort(sortby);
        console.log(this.querying)
        console.log(this.querying+"sorting")
    }else{
  
      this.querying=this.querying.sort('-__v')
    }
    return this;
  
  }
    
  
  //   sort(){
  //     if(this.querystr.sort){
  //       this.querying= this.querying.sort(this.querystr.sort)
  //       //  const sortby=this.querystr.sort.split(',').join('');
  //       //  this.querying=this.querying.sort(sortby);
  //       console.log(this.querying+"sorting")
  //   }else{
  //     this.querying=this.querying.sort('-__v')
  //   }
  //   return this;
  
  // }
  limitfields(){
      if(this.querystr.fields)
              {
                  const fields=this.querystr.fields.split(',').join(' ');
                  this.querying=this.querying.select(fields);
                 }
              else{
                  this.querying=this.querying.select('-__v');
              }
               return this;
            }
  
            paginate(){
              const page= this.querystr.page*1|| 1; //converting a string into number so that * by 1 and adding default value to it that is || 1 
              const limit=this.querystr.limit*1||10;
              const skip=(page-1)*limit;
              this.querying=this.querying.skip(skip).limit(limit);
              return this;
            }
          q
  
  }
    
  
  module.exports=apifeatures;