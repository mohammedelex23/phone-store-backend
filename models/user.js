var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

const User = mongoose.Schema({
    admin: {
        type: Boolean,
        default: false
    }
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)