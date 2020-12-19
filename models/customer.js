const mongoose = require('mongoose');

//Schema
const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:20
    },
    phone:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
        min:3,
        max:10
    },
    massage:{
        type:String,
        required:true,
        min:10,
        max:300
    },
    date:{
        type:Date,
        default:Date.now
    }
});

//New Model
module.exports = mongoose.model('Customer',customerSchema);