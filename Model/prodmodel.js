const mongoose = require("mongoose");
const validator = require("validator");
// const User= require('./usermodel');
const multer=require("multer")

const productschema = new mongoose.Schema({
  Productname: {
    type: String,
    unique: true,
    required: [true, "Please Enter Your Name"],
  },
  Productdescription: {
    type: String,
    unique: true,
    required: [true, "Please Enter Brand Name"],
  },
  Image: Array,
  Createdby: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "usersdatas",
    },
  ],
  CreatedAt: {
    type: Date,
    // default: now.Date
  },
  SoldBy:[
    {
      type: mongoose.Schema.ObjectId,
      ref: "usersdatas",
    },
  ], 
  UpdatedAt: {
    type: Date,
  },
  Information: {
    general: {
      modelname: String,
      brightness: String,
      maxprojectiondistance: String,
      projectortype: String,
      displaytype: {
        type: String,
        uppercase: true,
      },
      colour: {
        type: String,
        enum: ["black", "white"],
        default: "black",
      },
    },
  },
  assistantsupport: String,
});

// productschema.pre('save', async function(next){
//     const createdypromise=await this.Createdby.map(async id =>await User.findById(id));
//     console.log(createdypromise)
//     this.Createdby= await Promise.all(createdypromise);

//     next();
// })



const productmodel = mongoose.model("productdetails", productschema);
module.exports = productmodel;
