const express = require('express');
const morgan = require('morgan');
const authrouter=require('./../Routes/authRouter')
// const customerrors=require('./utils/customerror')
const customerrors=require('./../utils/customerror')
const prodrouter=require('./../Routes/prodRouter')
const globalerrorhandling=require('./../errorhandler')
const tagrouter=require('./../Routes/tagRouter');

let app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
 app.use(express.static('./public'))


app.use( authrouter)
app.use(prodrouter);
app.use(tagrouter)
app.all('*',(req,res,next)=>{
    
const err=new customerrors(`Can't find  ${req.originalUrl} on the server!`,404)
next(err);
});

app.use(globalerrorhandling);
module.exports = app;

