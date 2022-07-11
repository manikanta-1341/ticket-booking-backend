const express = require('express')
const route = express.Router()
const fromModule = require('../modules/order')

route.post('/create',fromModule.CreateOrder)


module.exports = route