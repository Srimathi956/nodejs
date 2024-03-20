const productmodel= require('./../Model/prodmodel');
const asyncerrorhandler = require("./../utils/asyncerrorhandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const customerror = require("./../utils/customerror");
const apifeatures = require("./../utils/apifeatures");




const postingproduct =asyncerrorhandler(async(req,res,next)=>{
    const newproduct = await productmodel.create(req.body);
  
    // const token = signToken(newproduct._id);
    
  
    res.status(201).json({
      status: "success",
      statusCode: 200,
      data:{newproduct}
      
      })
    });
    const getallproduct=asyncerrorhandler(async(req,res,next)=>{
       const  allusers= await productmodel.find();
       
       res.status(201).json({
        status:"success",
        statusCode:200,
        data:{
            allusers

        }
       })
    })



module.exports={postingproduct,getallproduct};