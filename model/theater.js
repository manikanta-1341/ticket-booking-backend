const mongoose  = require ('mongoose')
const schema = mongoose.Schema

const TheaterSchema = schema({
    name:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    cinemas:{
        type:Array,
        required:true,
    },
    soundSystem:{
        type:String,
        required:true
    }
})

const Theater = mongoose.model('theater',TheaterSchema,'theaters')

module.exports = Theater