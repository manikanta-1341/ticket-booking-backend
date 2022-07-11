const mongoose = require('mongoose')
const { find } = require('../model/theater')
const Theater = require('../model/theater')



module.exports.Get = async (req, res) => {
    try {
        let response = await Theater.find({})
        res.send(response)
    } catch (error) {
        res.send({ error: error })
    }
}


module.exports.Create = async (req, res) => {
    try {
        let new_theater = new Theater(req.body.theater)
        let exist_theater = await Theater.find({ name: new_theater.name })
        
        if (exist_theater.length === 0) {
            new_theater.cinemas.map((e) => e._id = mongoose.Types.ObjectId())
            await new_theater.save()
            res.send({ msg: "success" })
        }
        else {
            res.send({ error: "Theater Already Exist" })
        }
    }
    catch (err) {
        res.send({ error: err })
    }
}

module.exports.UpdateSeats = async (req, res) => {
    try {
        let theater_response = await Theater.findOne(
            { _id: req.params.id, "cinemas._id": mongoose.Types.ObjectId(req.body.movie_id) },
            { "cinemas.$": 1, _id: 0 }
        )
        let post = ''
        let delete_id = []
        theater_response.cinemas[0].selected?.map((m_obj) => {
            let showTime = m_obj.showTimes
            let showTime_hr = new Date(new Date().toLocaleDateString() + " " + showTime).getHours()
            let currentTime_hr = new Date(new Date().toLocaleString()).getHours()
            let showTime_date = new Date(m_obj.date).getDate()
            let current_date = new Date().getDate()
            if (showTime_hr < currentTime_hr && showTime_date < current_date) {
                
                delete_id.push(m_obj._id)
                post = true
            }
        })


        if (post) {
            delete_id.map(async (e, i) => {
                await Theater.findOneAndUpdate(
                    { _id: req.params.id },
                    { $pull: { "cinemas.$[cond].selected": { _id: e } } },
                    {
                        arrayFilters:
                            [
                                { "cond._id": mongoose.Types.ObjectId(req.body.movie_id) }
                            ]
                    }
                )
            })
        }


        await Theater.findOneAndUpdate(
            { _id: req.params.id, "cinemas._id": mongoose.Types.ObjectId(req.body.movie_id) },
            {
                $push: {
                    "cinemas.$[cond].selected": {
                        _id: mongoose.Types.ObjectId(),
                        date: req.body.date,
                        movie_id: req.body.movie_id,
                        showTimes: req.body.showTime,
                        seats: req.body.seats
                    }
                }
            },
            {
                arrayFilters: [{
                    "cond._id": mongoose.Types.ObjectId(req.body.movie_id)
                }]
            },
        )

        let response = await Theater.findOne(
            { _id: req.params.id, "cinemas._id": mongoose.Types.ObjectId(req.body.movie_id) }
        )
        res.send(response)
    } catch (error) {
        res.send({ error: error })
    }

}