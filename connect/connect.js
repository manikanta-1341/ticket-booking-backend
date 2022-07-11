const mongoose = require('mongoose')

module.exports.Connect = async(req,res)=>{
    try{
        let response = await mongoose.connect(process.env.mongodb_url)
        console.log("connection successful")
    }
    catch(err){
        res.send({msg:err})
    }
}