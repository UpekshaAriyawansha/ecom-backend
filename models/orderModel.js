const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
//     products: [
//         {
//         product:{
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Product',
//         },
//         count: Number,
//         color: String,
//     },
// ],
//     paymentIntent:{},
//     orderStatus:{
//         type: String,
//         default: 'Not Processed',
//         enum: [
//             'Not Processed',
//             'Cash on Delivery',
//             'Processing',
//             'Dispatched',
//             'Cancelled',
//             'Delivered',
//         ],
//     },
//     orderby: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },  


user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

shippingInfo: {
    firstName:{
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    other:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
},

paymentInfo: {
    razorpayOrderId: {
        type: String,

    },
    razorpayPaymentId: {
        type: String,
        required: true
    }
},

orderItems: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Color",
            required: true
        },
        quantity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quantity",
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: Number,
            required: true
        },
    }
],

    paidAt: {
        type: Date,
        default: Date.now()
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: "Ordered"
    }
},
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);