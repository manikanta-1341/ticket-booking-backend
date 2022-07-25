const Razorpay = require('razorpay');
const { v4: uuid4 } = require('uuid')
const fs = require('fs')
const path = require('path');
const User = require('../model/user')
const mongoose = require('mongoose')


var instance = new Razorpay({
  key_id: 'rzp_test_VowM3OfZOHOMjn',
  key_secret: 'RyPsqKndb8OjGhQQ5B0gTlex',
});



module.exports.CreateOrder = async (req, res) => {

  try {
    let response = await instance.orders.create({
      "amount": req.body.amount,
      "currency": "INR",
      "receipt": uuid4(),
    })
    let update_object = {
      ...response,
      user_id: req.body._id,
      user_ticket: req.body.user_ticket[0]
    }
    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body._id) },
      { $push: { payment_details: update_object } }
    )

    res.send(response)
  } catch (error) {
    console.log(error)
    res.send({ error: error })
  }
}




