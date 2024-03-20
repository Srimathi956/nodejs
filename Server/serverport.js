require('dotenv').config();
const dotenv = require('dotenv');
const multer=require("multer")

dotenv.config({path: './../userdataapis/config.env'});
const mongoose = require('mongoose');


const express=require('express')

process.on('uncaughtException',(err)=>{
    console.log("-----",err,err.name,err.message);
    console.log("uncaughtException has been occured! shutting down..")
    // 1--bad request, 0--good request
    process.exit(1);
})
const app = require('./app');
mongoose.connect(process.env.CONN_URL,{
    }).then((conn)=>{
   //console.log(process.env)
    console.log("DB Connection Successful")
})
// .catch((error) => {
   
//         console.log('Some error has occured'+error);
//  });


const port = process.env.PORT || 3000;
console.log("hello29")
const server=app.listen(port, () => {
    console.log('server has started...');
})

process.on('unhandledRejection',(err)=>{
    console.log(err.name,err.message);
    console.log("unhandled rejectiion occured! shutting down..")
    server.close(()=>{
        process.exit(1)
    })
})
