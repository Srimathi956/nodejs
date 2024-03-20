const customerror=require('./utils/customerror')

const deverrors=(res,error)=>{
    res.status( error.statusCode).json({
         status: error.statusCode,
         message: error.message,
        // stackTrace : error.stack,
        // error: error
    });

}

const casterrorhandler=(err)=>{

const msg=`Invalid value for field ${err.path} : ${err.value} for field `
return new customerror(msg,400);

}


const duplicatekeyerrorhandler=(err) =>{
    const name=err.keyValue.name;
  const msg=`There is already a username with the name of ${name}.Please use another name`;
    return new customerror(msg,400);
}
/*  if there is name and email are missing then it will show these are required field from userModelschema
by using the object we are taking the values in JSON then val will have "ERROR MESSAGES IN ARRAY FORMAT" 
then it will return to the "ERRORS" by using the join method  joining and sending as "MESSAGE"
*/
const handleexpired=(err)=>{
    return new customerror('JWT has been Expired.Please login again!',401)
}
const invalidtoken=(err)=>{
    return new customerror('Invalid token.Please login again',401);
}

const validationerrorhandling=(err)=>{
  const errors= Object.values(err.errors).map(val =>val.message)
  const errorMessage=errors.join('. ')
  const msg=`Invalid input data: ${errorMessage} `;

  return new customerror(msg,400);

}
// all the error which are created by the custom error which is operational errors are comes under if
const proderrors=(res,error)=>{
    if(error.isOperational){
        res.status( error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })

    }
    // there are some error which are created by mongoose for that we are not setting the operational 
    else{
        res.status(500).json({
            status: 'error',
            message:'something went wrong! please try again later'
        })
    }
    
}

// Global Error handler if we are running the script in production then it will run the prod
module.exports= (error,req,res,next)=>{
    error.statusCode= error.statusCode|| 500;
    error.status=error.status || ' error';


   if(process.env.NODE_ENV==='development'){
    if(error.name==='CastError')error= casterrorhandler(error);
    if(error.code===11000) error = duplicatekeyerrorhandler(error)
    if(error.name==='ValidationError') error=validationerrorhandling(error);
    if(error.name==='TokenExpiredError') error= handleexpired(error)
    if(error.name==='JsonWebTokenError') error=invalidtoken(error)
    
        deverrors(res,error)
   }else if(process.env.NODE_ENV==='production'){
    // given value is wrong or mismatched for feild
       if(error.name==='CastError')error= casterrorhandler(error);
    //  using the same username for new user  
       if(error.code===11000) error = duplicatekeyerrorhandler(error)
    //    if the required feild is not filled or missing
       if(error.name==='ValidationError') error=validationerrorhandling(error);
        if(error.name==='TokenExpiredError') error= handleexpired(error)
        if(error.name==='JsonWebTokenError') error=invalidtoken(error)
       proderrors(res,error)
       }
        
        
    }   
