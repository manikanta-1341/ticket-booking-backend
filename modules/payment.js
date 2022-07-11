const mongoose = require('mongoose');
const { createHmac } = require('crypto');
const order_details = require('../orders/order.json')
const ticket = order_details.user_ticket
const User = require('../model/user');
const fs = require('fs')
const path = require('path')
const Theater = require('../model/theater')




module.exports.Payment = async (req, res) => {
  try {
    const secret = "RyPsqKndb8OjGhQQ5B0gTlex";
    
    if (req.body.razorpay_signature) {
      const generated_signature = createHmac('sha256', secret)
        .update(order_details.id + "|" + req.body.razorpay_payment_id, secret)
        .digest('hex')
      if (generated_signature === req.body.razorpay_signature) {
        let _id = mongoose.Types.ObjectId()
        let User_response = await User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(order_details.user_id) },
          {
            $push: {
              tickets: {
                _id: _id,
                totalValue: (order_details.amount) / 100,
                order: order_details.user_ticket,
              }
            }
          },
          { new: true }
        )


        
        let theater_response = await Theater.findOne(
          { _id: ticket.theater_id, "cinemas._id": mongoose.Types.ObjectId(ticket.movie_id) },
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
              { _id: ticket.theater_id },
              { $pull: { "cinemas.$[cond].selected": { _id: e } } },
              {
                arrayFilters:
                  [
                    { "cond._id": mongoose.Types.ObjectId(ticket.movie_id) }
                  ]
              }
            )
          })
        }

        await Theater.findOneAndUpdate(
          { _id: ticket.theater_id, "cinemas._id": mongoose.Types.ObjectId(ticket.movie_id) },
          {
            $push: {
              "cinemas.$[cond].selected": {
                _id: mongoose.Types.ObjectId(),
                date: new Date(ticket.date).toLocaleDateString(),
                movie_id: ticket.movie_id,
                showTimes: ticket.show_time,
                prices:ticket.price,
                totalPrice:ticket.totalPrice,
                seats: ticket.seatNo

              }
            }
          },
          {
            arrayFilters: [{
              "cond._id": mongoose.Types.ObjectId(ticket.movie_id)
            }]
          },
        )

        fs.writeFileSync(path.join(__dirname, "../orders", `order.json`), JSON.stringify(
          {
            ...order_details,
            razorpay_response: req.body
          },
          null, 2))

        res.redirect(`${process.env.frontend_url}/ticket`)
      }
      else {
        res.send({ error: "Payment is not authorise" })
      }
    }
    else {
      res.send({ error: "Payment success but no response" })
    }
  }
  catch (err) {
    res.send({ error: err })
  }
}