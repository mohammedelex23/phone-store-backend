const mongoose = require('mongoose')



const order = mongoose.Schema({
    total: { type: Number, required: true },
    products: [
        {
            name: {type: String, required: true},
            price: {type: Number, required: true},
            count: {type: Number, required: true}
        }
    ]
}, {
    timestamps: true
})


const Order = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    orders: [order]
})

module.exports = mongoose.model('Order', Order)