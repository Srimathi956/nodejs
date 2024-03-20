const express = require('express');
const prodcontroller=require('./../Controller/prodController')
const authcontroller=require('./../Controller/authcontroller')
const Router= express.Router();

Router.post('/creatproduct',authcontroller.protect,authcontroller.restrict('admin'),prodcontroller.postingproduct)
Router.get('/getallproduct',prodcontroller.getallproduct)
Router.patch('/updateproduct',authcontroller.restrict('admin'))
module.exports=Router;