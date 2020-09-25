var mongoose = require('mongoose');

const Product = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    image: {type: String, required: true, unique: true},
    company: {type: String, required: true, unique: true},
    price: {type: Number, required: true },
    count: {type: Number, required: true, default: 0},
    total: {type: Number, required: true, default: 0},
    description: {type: String, required: true},
    inCart: {type: Boolean, default: false}
})

module.exports = mongoose.model('Product', Product)