const mongoose = require('mongoose')
const schema = mongoose.Schema

const MovieSchema = schema({
    title:{
        type:String,
        required:true
    },
    releaseDate:{
        type:String,
        required:true
    },
    cast:{
        type:Array,
        required:true,
        default:[]
    },
    crew:{
        type:Array,
        required:true,
        default:[]
    },
    segment:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    certificate:{
        type:String,
        required:true
    },
    cinemaType:{
        type:String,
        required:true,
        enum:["2D","3D"],
        default:"2D"
    },
    language:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    votes:{
        type:Number,
        default:0
    },
    like:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        deafult:"https://image.shutterstock.com/image-vector/online-cinema-art-movie-watching-260nw-584655766.jpg"
    }


})

const Movie = mongoose.model('movie',MovieSchema,'movies')  

module.exports = Movie