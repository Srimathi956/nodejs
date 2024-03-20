const User = require("./../Model/usermodel");
const asyncerrorhandler = require("./../utils/asyncerrorhandler");
const jwt = require("jsonwebtoken");
const util = require("util");
const bcrypt = require("bcryptjs");
const customerror = require("./../utils/customerror");
const apifeatures = require("./../utils/apifeatures");
// const bcrypt = require('bcryptjs');
const sendemail = require("./../utils/email");
const { log, Console } = require("console");
const crypto = require("crypto");
const { reset } = require("nodemon");
const { nextTick } = require("process");
const verification = require("./..//Model/verification");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const getalluser = asyncerrorhandler(async (req, res, next) => {
  const features = new apifeatures(User.find(), req.query)
    .filter()
    .sort().limitfields;
  // console.log(req.query);

  // const excludefields=['page','limit','fields','sort'];
  // const cloned = Object.assign({}, req.query);
  //         const objquery={...cloned}
  //         // console.log(req.query)

  //         excludefields.forEach((el) => {
  //            delete objquery[el]
  //          })

  //          let querystring = JSON.stringify(req.query);
  //         //  console.log("1234"+querystring)
  //         querystring=querystring.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
  //         const queryobj= JSON.parse(querystring)
  //         // const querying=this.querying.find(queryobj)

  // // filtering
  // console.log(queryobj+"queryobj")

  const newuser = User.find();

  // if(req.query.sort){
  //   newuser = newuser.sort(req.query.sort)
  // }

  const user = await newuser;
  console.log(user);
  res.status(200).json({
    status: "success",
    statusCode: 200,
    user: user,
  });
});

const protect = asyncerrorhandler(async (req, res, next) => {
  //    read the token & check if it exist
  console.log(req.body);
  const testtoken = req.headers.authorization;
  // console.log("testtoken"+testtoken);
  let token;
  if (testtoken && testtoken.startsWith("Bearer")) {
    token = testtoken.split(" ")[1];
  }
  if (!token) {
    next(new customerror("You are not logged in:)", 401));
  }

  console.log("hello" + token);

  // validate the token

  // token iat is in seconds
  const decodedtoken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );
  console.log(decodedtoken);

  // if the user exists

  const userexist = await User.findById(decodedtoken.id);
  console.log(decodedtoken.id);
  console.log("userexist" + userexist);
  if (!userexist) {
    const error = new customerror(
      "The user with given token does not exist",
      401
    );
    next(error);
  }

  // if the user changed password after the token was issue

  const ispasswordChanged = await userexist.ispasswordchanged(decodedtoken.iat);
  if (ispasswordChanged) {
    const error = new customerror(
      "The password has been changed recently.Please login again",
      401
    );
    return next(error);
  }
  // allow user to access route
  req.userexist = userexist;
  next();
});
const restrict = (role) => {
  return (req, res, next) => {
    console.log("in restrict");
    if (req.userexist.role !== role) {
      console.log("");
      const error = new customerror(
        "You do not  have permission to perform this ation",
        403
      );
      next(error);
    }
    next();
  };
};

const verifycode = asyncerrorhandler(
  async (req, res, next) => {
    const reqotp = req.body.otp;
    console.log("sendingotp" + reqotp);
    const email = req.body.email;

    // const userdet= await User.findOne({email: email})
    const user = await verification.findOneAndDelete({
      email: req.body.email,
      otpexpireson: { $gt: Date.now() },
    });
    console.log(user)
    console.log(req.body.email);
    if (!user) {
      const error = new customerror("user does not match!", 400);
      next(error);
    }

    
    console.log(user.otp);
    const hashedotp=user.otp;

    const compareotp = async function(reqotp, hashedotp){
      console.log("model")

     return await bcrypt.compare(reqotp,hashedotp);
    }
    if (!(await compareotp(reqotp, user.otp))) {
      const error = new customerror("Incorrect email or password ", 400);
      return next(error);
    }
    // user.password=req.body.password;
    // console.log(req.body.password + "passwordupdate" + user.password);
    
    

    
    console.log("hello361");
    // LOGIN THE USER
    // console.log("welcome");
    res.status(200).json({
      status: "success",
      statusCode: 200,
    });
  }
);


const forgotpassword = asyncerrorhandler(async (req, res, next) => {
  // 1.GET USER BASED ON POSTED EMAIL
  const userdet = await User.findOne({ email: req.body.email });
  console.log("email " + req.body.email);
  if (!userdet) {
    const error = new customerror(
      "we could not find the user with given email",
      404
    );
    next(error);
  }
  // const OTP = await creatingotp();

  const verificationmodel = await verification.findOne({
    email: req.body.email,
  });
  console.log("--1-->", verificationmodel);
  // 2.GENERATE A RANDOM RESSET TOKEN
  if (verificationmodel !== null) {
    console.log("hello");
    const error = new customerror(
      "Already otp has been sended Please use that",
      404
    );
    next(error);
  }
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  console.log("!S" + otp);
  const hashOtp = await bcrypt.hash(otp, 12);
  console.log("Encryted otp" + hashOtp);
  const optCreatedAt = Date.now();
  const otpExpiredAt = Date.now() + 3600000;
console.log("email",req.body.email);
await verification.create({
  email:req.body.email,
  otp:hashOtp,
  otpcreatedon:optCreatedAt,
  otpexpireson:otpExpiredAt,
})
  
  

  console.log("156");
  // const reseturl = `${req.protocol}://${req.get("host")}/resetpassword/;
  const message = `We have recieved a password reset request.Please use the below link to reset your password\n\n ${otp}\n\n This reset  password link will be valid only for 10 minutes. `;
  try {
    await sendemail({
      email: 
      req.body.email,
      subject: "password change request received",
      message: message,
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Password reset code send to the user email",
      otp:otp
    });
  } catch (err) {
    verificationmodel.otp = undefined;
    verificationmodel.otpexpireson = undefined;
    userdet.userdet.save({ validateBeforeSave: false });

    return next(
      new customerror(
        "There was an error sending password reset email.Please try again later",
        500
      )
    );
  }
});

const resetpassword = asyncerrorhandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordresettoken: token,
    passwordresetokenexpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new customerror("Token is invalid or has expired!", 400);
    next(error);
  }
  // RESETING THE USER PASSWORD
  user.password = req.body.password;
  console.log(req.body.password + "passwordupdate" + user.password);
  user.passwordresettoken = undefined;
  user.passwordresetokenexpires = undefined;
  user.passwordchangedAt = Date.now();

  user.save();
  // LOGIN THE USER
  const logintoken = signToken(user._id);
  // console.log("welcome");
  res.status(200).json({
    status: "success",
    statusCode: 200,
    token: logintoken,
  });
});

const getuser = asyncerrorhandler(async (req, res, next) => {
  const features = new apifeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();

  let userda1 = User.find();
  const userdet = await userda1;
  res.status(200).json({
    status: "success",
    user: userdet.length,
    data: {
      userdet,
    },
  });
});

const signup = asyncerrorhandler(async (req, res, next) => {
  const newuser = await User.create(req.body);

  const token = signToken(newuser._id);

  res.status(201).json({
    status: "success",
    statusCode: 200,
    token,
    data: {
      userdata: newuser,
    },
  });
});

const login = asyncerrorhandler(async (req, res, next) => {
  const email = req.body.email;
  console.log("Request" + req.body.email);
  const password = req.body.password;
  console.log("Password" + req.body.password);
  console.log("email" + email);
  //  checks either email or password is missing
  if (!email || !password) {
    const error = new customerror(
      "Please provide email ID &nPassword for Login in!",
      400
    );
    return next(error);
  }
  // check if user exists with given email
  const user = await User.findOne({ email }).select("+password");
  console.log("User Exists");
  //  const ismatch = await user.comparePasswordInDb(password,user.password)

  // check if user exists & password matches
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    //comparing the two password are same or not   "PASSWORD IS FROM REQBODY", USER,PASSWORD IS FROM DB
    console.log("same");
    const error = new customerror("Incorrect email or password ", 400);
    return next(error);
  }
  const token = signToken(user._id);
  console.log("welcome");
  res.status(200).json({
    status: "success",
    statusCode: 200,
    token,
  });
});

const deleteparticularuser = asyncerrorhandler(async (req, res, next) => {
  // try{
  await User.findByIdAndDelete(req.params.id);
  // await User.create(req.body);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updatepassword = asyncerrorhandler(async (req, res, next) => {
  //GET CURRENT USER DATA FROM DATABASE
  console.log("up");
  const user = await User.findById(req.userexist._id).select("+password");

  // CHECK IF THE GIVEN PASSWORD IS CORRECT
  if (
    !(await user.comparePasswordInDb(req.body.currentpassword, user.password))
  ) {
    return next(
      new customerror("The current password you provided is wrong", 401)
    );
  }
  console.log("up233");
  // IF GIVEN PASSWORD IS  CORRECT ,UPDATE USER PASSWORD WIH NEW VALUE
  user.password = req.body.password;
  await user.save();

  // LOGIN USER & SEND JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const forgottenpassword = asyncerrorhandler(async (req, res, next) => {
  // 1.GET USER BASED ON POSTED EMAIL
  const userdet = await User.findOne({ email: req.body.email });
  console.log("email " + userdet);
  if (!userdet) {
    const error = new customerror(
      "we could not find the user with given email",
      404
    );
    next(error);
  }
  // 2.GENERATE A RANDOM RESSET CODE
  const OTP = await userdet.creatingcodeforforgotpassword();
  console.log(OTP);
  userdet.save({ validateBeforeSave: false });

  // 3. SEND THE TOKEN BACK TO THE USER EMAIL
  const reseturl = `${req.protocol}://${req.get("host")}/resetpassword/${OTP}`;
  const message = `We have recieved a password reset request.Please use the below link to reset your password\n\n ${reseturl}\n\n This reset  password link will be valid only for 10 minutes. `;
  try {
    await sendemail({
      email: userdet.email,
      subject: "password change request received",
      message: message,
    });

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Password reset link send to the user email",
      code: OTP,
    });
  } catch (err) {
    userdet.OTP = undefined;
    userdet.OTPCreatedAt = undefined;
    userdet.OTPExpiresAt = undefined;
    userdet.save({ validateBeforeSave: false });

    return next(
      new customerror(
        "There was an error sending password reset email.Please try again later",
        500
      )
    );
  }
});

const sendingotpforresetingpassword = asyncerrorhandler(
  async (req, res, next) => {
    const reqotp = req.body.OTP;
    console.log("sendingotp" + reqotp);
    const email = req.body.email;

    // const userdet= await User.findOne({email: email})
    const user = await User.findOne({
      email: req.body.email,
      OTPExpiresAt: { $gt: Date.now() },
    });
    console.log(req.body.email);
    if (!user) {
      const error = new customerror("Token is invalid or has expired!", 400);
      next(error);
    }

    // check if user exists & code matches
    //comparing the two password are same or not   "code IS FROM REQBODY", USER,PASSWORD IS FROM DB
    // console.log("same");
    console.log(user.OTP);
    if (!(await user.comparePasswordInDb(reqotp, user.OTP))) {
      const error = new customerror("Incorrect email or password ", 400);
      return next(error);
    }
    // user.password=req.body.password;
    console.log(req.body.password + "passwordupdate" + user.password);
    user.OTP = undefined;
    user.OTPCreatedAt = undefined;
    // user.passwordchangedAt=Date.now();
    user.OTPExpiresAt = undefined;

    user.save();
    console.log("hello361");
    // LOGIN THE USER
    // console.log("welcome");
    res.status(200).json({
      status: "success",
      statusCode: 200,
    });
  }
);

const updatingpasword = asyncerrorhandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: req.body.email });

  user.password = req.body.password;
  console.log(req.body.password + "passwordupdate" + user.password);
  user.passwordresettoken = undefined;
  user.passwordresetokenexpires = undefined;
  user.passwordchangedAt = Date.now();

  user.save();
  // LOGIN THE USER
  // console.log("welcome");
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    statusCode: 200,
    token,
  });
});
const filterReqobj = (obj, ...allowedfields) => {
  const newobj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedfields.includes(prop)) newobj[prop] = obj[prop];
  });
  return newobj;
};

const UpdateMe = asyncerrorhandler(async (req, res, next) => {
  // 1.CHECK IF REQUEST DATA CONTAIN PASSWORD
  if (req.body.password) {
    return next(
      new customerror(
        "You cannot update your password using this endpoint",
        400
      )
    );
  }

  // UPDATE USER DETAIL

  const filterobj = filterReqobj(req.body, "name", "email");
  const updateduser = await User.findByIdAndUpdate(
    req.userexist._id,
    filterobj,
    { runValidators: true }
  );
  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Updated Successfully",
    data: updateduser,
  });
});
// DELETING USER RECORD

const deleteme = asyncerrorhandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.userexist.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getuser,
  signup,
  login,
  deleteme,
  getalluser,
  protect,
  deleteparticularuser,
  restrict,
  UpdateMe,
  updatingpasword,
  forgotpassword,
  resetpassword,
  updatepassword,
  forgottenpassword,
  sendingotpforresetingpassword,
  verifycode
};
