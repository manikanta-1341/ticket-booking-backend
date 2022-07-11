const express = require('express')
const route = express.Router()
const fromModule = require('../modules/movie')

route.get('/',fromModule.GetMovies)
route.get('/:string',fromModule.GetCustomMovies)    
route.post('/create',fromModule.CreateMovie)
route.delete('/delete/:id',fromModule.DeleteMovie)

module.exports = route