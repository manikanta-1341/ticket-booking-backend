const express = require('express')
const route = express.Router()
const fromModule = require('../modules/user')

route.get('/:id',fromModule.GetUser)
route.patch('/review/:id',fromModule.UpdateReview) 


module.exports = route