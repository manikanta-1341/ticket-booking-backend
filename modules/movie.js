const mongoose = require('mongoose')
const Movie = require('../model/movie')
const Theater = require('../model/theater')

module.exports.GetMovies = async (req, res) => {
    try {

        let response = await Movie.find({})
        res.send(response)
    }
    catch (err) {
        res.send({ error: err })
    }
}


module.exports.GetCustomMovies = async (req, res) => {
    try {
        
        let movies = await Movie.find({})
        switch (req.params.string) {
            case "language":
                let language_response = movies.filter((e) => e.language.includes(req.query.s))
                language_response.length > 0 ? res.send(language_response) : res.send({ error: "no records" })
                break;
            case "title":
                let title_response = await Movie.find({ title: req.query.s.replace('-', ' ') })
                res.send(title_response)
                break;
            case "segment":
                let segment_response = movies.filter((e) => e.segment.includes(req.query.s))
                segment_response.length > 0 ? res.send(segment_response) : res.send({ error: "no records" })
                break;
            default:
                res.send({error : "no records"})
                break;
        }

    }
    catch (err) {
        res.send({ error: err })
    }
}

module.exports.GetCustomTheater = async (req, res) => {
    switch (req.params.string) {
        case "location":
            let location_response = await Movie.find({ location: req.query.s })
            res.send(location_response)
            break;
        case "city":
            let city_response = await Movie.find({ city: req.query.s })
            res.send(city_response)
            break;
        default:
            res.send({error:"no records"})
            break;
    }
}


module.exports.CreateMovie = async (req, res) => {
    try {
        let new_movie = new Movie(req.body.movie)
        let movies = await Movie.find({})
        
        // let exist_movie_date = await Movie.find({releasingDate : new_movie.releasingDate})
        let exist_movie_name = await Movie.find({ title: new_movie.title })
        
        if (exist_movie_name.length === 0) {
            
            await new_movie.save()
            res.send({ msg: "created" })
        }
        else {
            res.send({ error: "Movie already exist" })
        }
    } catch (err) {
        res.send({ error: err })
    }
}


module.exports.DeleteMovie = async(req,res)=>{
    try {
        await Movie.findOneAndDelete(
            {_id : mongoose.Types.ObjectId(req.params.id)},
        )
        let theater_id = req.params.id
        let movie_id = req.query.m
        let movie = await Movie.findOne({_id : mongoose.Types.ObjectId(movie_id)})
        let response = await Theater .findOneAndUpdate(
            { _id : mongoose.Types.ObjectId(theater_id)},
            { $pull: {cinemas:{name : movie.title}} },
            {new:true}
        )
        res.send(response)
    } catch (error) {
        res.send({error:error})
    }
}