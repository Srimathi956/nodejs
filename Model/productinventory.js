const mongoose=require('mongoose')
const inventory =new mongoose.Schema({
    Productname: {
        type: String,
        unique: true
    },
    Quantity:Number
})

const inventorymodel=mongoose.model('ProductInventory',inventory)
module.exports  =inventorymodel;