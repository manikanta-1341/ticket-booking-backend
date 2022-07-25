const express = require('express')
const route = express.Router()
const fromModule = require('../modules/payment')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

route.post('/',urlencodedParser,fromModule.Payment)

module.exports = route 