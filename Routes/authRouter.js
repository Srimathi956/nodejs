const express = require('express');
const authcontroller= require('./../Controller/authcontroller')

const router= express.Router();
// console.log('helloar')
router.get('/getuser',authcontroller.protect ,authcontroller.getuser)
router.post('/signup',authcontroller.signup);

router.post('/login',authcontroller.protect,authcontroller.login)

router.delete('/deleteuser/:id',authcontroller.protect,authcontroller.restrict('admin'),authcontroller.deleteparticularuser)
// router.post('/forgotpassword',authcontroller.forgotpassword);
router.patch('/resetpassword/:token',authcontroller.resetpassword)
// router.patch('/resetingpassword/:code',authcontroller.sendingotpforresetingpassword)


router.post('/forverification',authcontroller.forgotpassword)
router.patch('/otpverification',authcontroller.verifycode)

router.patch('/updatepassword',authcontroller.protect,authcontroller.updatepassword)
// router.post('/loginuser',authcontroller.protect,authcontroller.loginuser)
router.patch('/user/updateme',authcontroller.protect,authcontroller.UpdateMe);
router.delete('/deleteme',authcontroller.protect,authcontroller.deleteme)
router.post('/forgottenpassword',authcontroller.forgottenpassword)
router.patch('/otpforresetpassword',authcontroller.sendingotpforresetingpassword)
router.get('/getallusers',authcontroller.getalluser)
router.patch('/updatingpasswordwithotp',authcontroller.updatingpasword)

module.exports= router;