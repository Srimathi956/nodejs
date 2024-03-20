const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const crypto=require('crypto');


const verifyschema = new mongoose.Schema({
 
  email: String,
  otp: String,
  otpcreatedon: {
    type: Date,
  },
  otpexpireson: Date
});
verifyschema.methods.creatingotp = async function(){
console.log("14")
    const otp=`${Math.floor(1000+Math.random()*9000)}`
    console.log("!S"+otp);
    this.otp=await bcrypt.hash(otp,12);
    console.log("Encryted otp"+this.otp);
    this.otpcreatedon=Date.now();
    this.otpexpireson=Date.now()+3600000;
    return otp
 }
const verifymodel = mongoose.model("verification", verifyschema);
module.exports = verifymodel;
