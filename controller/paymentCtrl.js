const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: "oooo",
    key_secret: "ooo", //razorpay details
})

const checkout = async (req, res) => {
    const {amount}=req.body
    const option = {
        amount: amount * 100,
        currency: "LKR",
    }
    const order = await instance.orders.create(option)
    res.json({
        success: true,
        order
    })
}

const paymentVerification = async (req, res) => {
    const {razorpayOrderId, razorpayPaymentId} = req.body
    res.json({
        razorpayOrderId: razorpayPaymentId
    })
}

module.exports = {
    checkout, paymentVerification
}