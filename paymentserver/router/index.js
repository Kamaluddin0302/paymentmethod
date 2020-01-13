let express = require("express");
let Router = express.Router()

let stripe = require("stripe")("sk_test_RjLVDTBWeNSwy4lsS62RDTDi00sjIzqeH7")
const uuid = require('uuid/v4');
Router.get("/home", (req, res) => {
    res.send({
        message: "It home Get Request"
    })
})

Router.post("/post", (req, res) => {
    console.log(req.body)
})

Router.post("/checkout", async (req, res) => {
    console.log("Request : ", req.body)
    try {
        const { product, token } = req.body

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const idempotency_key = uuid()

        const charge = await stripe.charge.create({
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "Purchased the ",
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {
            idempotency_key
        }
        )
        console.log("mycharge" + charge)
        res.send({
            message: "success"
        })
    }
    catch (err) {
        res.send({
            message: "err"
        })
        status = "failure"
    }
})
module.exports = Router