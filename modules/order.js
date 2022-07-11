const Razorpay = require('razorpay');
const { v4: uuid4 } = require('uuid')
const fs = require('fs')
const path = require('path');


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
    fs.writeFileSync(path.join(__dirname, "../orders", `order.json`), JSON.stringify(
      {
        ...response,
        user_id: req.body._id,
        user_ticket: req.body.user_ticket[0]
      },
      null, 2))
    res.send(response)
  } catch (error) {
    console.log(error)
    res.send({ error: error })
  }
}




