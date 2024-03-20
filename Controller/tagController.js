const tagschema=require('./../Model/tagmodel');
const asyncerrorhandler = require("./../utils/asyncerrorhandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const customerror = require("./../utils/customerror");
const apifeatures = require("./../utils/apifeatures");
const { log } = require('console');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
  };
  


const getalluser=asyncerrorhandler(async(req,res,next)=>{

    const tags=await tagschema.find();
    res.status(200).json({
    status:'success',
    statusCode:200,
    user:tags
  })
})

const createtag=asyncerrorhandler(async(req,res,next)=>{
console.log(req.body)
// asyncErrorHandler(async (req, res, next) => {
//   console.log("Req for create", req.body);
//   const newUser = await User.create(req.body);
//   console.log(newUser);
//   const token = signToken(newUser._id);
//   res.status(201).json({
//       status: "success",
//       token,
//       data: {
//           user: newUser,
//       }}
const newtag=await tagschema.create(req.body);
console.log(newtag);
    res.status(200).json({
    status:'success',
    statusCode:200,
    user:{
      tag:newtag
    }
  })

})
const updatetag=asyncerrorhandler(async(req,res,next)=>{
const updatetag=await tagschema.findByIdAndUpdate(req.params.id,req.body,{new:true , runValidators:true})
console.log(updatetag)

res.status(200).json({
  status:'success',
  statusCode:200

})
})


const deletetag= asyncerrorhandler(async(req,res,next)=>{
  const  deletedtag= await tagschema.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status:'success',
    data: null
  })
})

module.exports={getalluser,createtag,updatetag,deletetag}