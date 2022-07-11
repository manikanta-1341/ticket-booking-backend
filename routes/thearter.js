const express = require('express')
const route = express.Router() 
const fromModule = require('../modules/theater')

route.get('/',fromModule.Get)
route.post('/create',fromModule.Create)
route.patch('/update/seats/:id',fromModule.UpdateSeats)



module.exports = route