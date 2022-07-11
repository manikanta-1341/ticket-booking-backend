const express = require("express")
const dotenv = require('dotenv')
const cors = require('cors')
const connection = require('./connect/connect')
const app = express()
app.use(express.json())
dotenv.config()
connection.Connect()
app.use(cors())



const auth = require('./routes/authentication')
const movie = require('./routes/movies')
const theater = require('./routes/thearter')
const order = require('./routes/order')
const payment = require('./routes/payment')
const user = require('./routes/user')


app.use('/',auth)
app.use('/movies',movie)
app.use('/theater',theater) 
app.use('/order',order)   
app.use('/payment',payment)  
app.use('/user',user)





app.listen(process.env.PORT || 5000)