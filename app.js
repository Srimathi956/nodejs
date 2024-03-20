const express = require('express');
const morgan = require('morgan');
const userRouter = require('./userRouter');
const customerrors=require('./utils/customerror')
const globalerrorhandling=require('./errorhandler')
let app = express();

app.use(express.json());
console.log("hello8")
//  app.use(express.static('./public'))

//USING ROUTES

app.use( userRouter)
app.all('*',(req,res,next)=>{
    
const err=new customerrors(`Can't find  ${req.originalUrl} on the server!`,404)
next(err);
});
app.use(globalerrorhandling);
module.exports = app;
