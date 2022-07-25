const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = schema({
    name:{
        type:String, 
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true,
    },
    pincode:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    randomString:{
        type:String
    },
    verified:{
        type:String,
        default:"no"
    },
    tickets:{
        type:Array,
        default:[]
    },
    reviews:{
        type:Array,
        default:[]
    },
    payment_details:{
        type:Array,
        default:[]
    }
})

const User = mongoose.model('users',UserSchema,'users')  

module.exports = User