class customerror extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status=statusCode>= 400 && statusCode <500? 'fail' : 'error';
        // console.log("hello3custerror"+statusCode+message)
    this.isOperational=true;
    Error.captureStackTrace(this, this.constructor);
    }
}
module.exports=customerror

