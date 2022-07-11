const User = require('../model/user')



module.exports.GetUser = async (req,res)=>{
    try{
        let response = await User.find({_id : req.params.id})
        res.send(response)
    }
    catch(error){
        res.send({error:error})
    }
}





module.exports.UpdateReview = async (req, res) => {
    try {
        let response = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    reviews:req.body.obj
                }
            },
            {new:true}
        )
        res.send(response)
    } catch (error) {
        res.send({ error: error })
    }
}