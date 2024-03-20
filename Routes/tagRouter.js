const express = require('express');
const router= express.Router();
const tagcontroller=require('./../Controller/tagController')
router.get('/gettag',tagcontroller.getalluser);
router.post('/createtag',tagcontroller.createtag);
router.patch('/updatetag/:id',tagcontroller.updatetag);
router.delete('/deletetag/:id',tagcontroller.deletetag)

module.exports=router;