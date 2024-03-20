const mongoose=require('mongoose')
const validator = require('validator');


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
        mobile:Number ,
        password:{
            type: String,
            required:[true,'Please Enter a password. ']
            // createdat: {
        //     type: Date,
        //     default: Date.now()
        //     },
        }
    })




const userinfos=mongoose.model('information',userschema)

module.exports  = userinfos;