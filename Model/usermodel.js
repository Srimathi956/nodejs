const mongoose=require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto=require('crypto');


const userschema =new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please Enter Your Name'],
        unique: true
    },
    email:{
        type: String,
        required: [true,'Please  Enter an Email'],
         unique:true,
         lowercase:true,
         validate :[validator.isEmail,'Please enter a valid email.']

    },
        mobile:Number,
        role:{
            type: String,
            enum:['user','admin'],
            default:'user'
        },
        password:{
            type: String,
            required:[true,'Please Enter a password. '],
            select :false
        },
        active:{
            type:Boolean,
            default:true,
            select:false
        }
        ,
        passwordchangedAt: Date,
        passwordresettoken:String,
        passwordresetokenexpires: Date,
        OTP: String,
        OTPCreatedAt:Date,
        OTPExpiresAt:Date,
        age:Number

        //this time is in millisecond
    })
    userschema.pre('save',async function(next){
        if(!this.isModified('password')) return next();
       this.password=await bcrypt.hash(this.password,12);
       next();
    })

    // userschema.pre('save',async function(next){
    //     if(!this.isModified('OTP')) return next();
    //    this.OTP=await bcrypt.hash(this.OTP,12);
    //    console.(this.OTP)
    //    next();
    // })
    userschema.methods.comparePasswordInDb = async function(pswd,pswddb){
        console.log("model")

       return await bcrypt.compare(pswd,pswddb);

    }

    // userschema.methods.comparePassInDb=async function(code,codeindb){
    //     return await bcrypt.compare(code,codeindb)
    // }
    // jwttimestamp----> Token created time

    userschema.methods.ispasswordchanged=async function (JWTTimestamp){
         if(this.passwordchangedAt){
            const pswdchangedtimestamp = parseInt(this.passwordchangedAt.getTime()/1000,10);//to change the date in milliseconds
            console.log(pswdchangedtimestamp,JWTTimestamp);
            return JWTTimestamp < pswdchangedtimestamp;// 1709633623<1709683200
         }
         return false;
        }
        

        userschema.methods.createresetpasswordtoken =  async function(){
            const resetToken = crypto.randomBytes(32).toString('hex')
           console.log("model"+resetToken);
            this.passwordresettoken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.passwordresetokenexpires=Date.now()+10*60*1000;
            
            console.log(resetToken,this.passwordresettoken);
            return   resetToken;
         }
         userschema.methods.creatingcodeforforgotpassword= async function(){

            const otp=`${Math.floor(1000+Math.random()*9000)}`
            console.log("!S"+otp);
            this.OTP=await bcrypt.hash(otp,12);
            console.log("Encryted otp"+this.OTP);
            this.OTPCreatedAt=Date.now();
            this.OTPExpiresAt=Date.now()+3600000;
            return otp
         }
         
         userschema.pre(/^find/,function(next){
            // this keyword in the function will point to current query
            this.find({active:{$ne: false}});
            next();
         })
        


        //    this.passwordresettoken = crypto.createHash('sha256').update(resettoken).digest('hex');
        //    this.passwordresetokenexpires=Date.now()+10*60*1000;
           
        //    console.log(resettoken,this.passwordresettoken)
       
const usermodel=mongoose.model('usersdata',userschema)
module.exports  =usermodel;