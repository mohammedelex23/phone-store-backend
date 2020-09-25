var config = require('./config')
var passport = require('passport')
var LocalStrategy = require('passport-local')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var jwt = require('jsonwebtoken')
var User = require('../models/user')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign(
        { _id: user._id },
        config.JWT_SECRET,
        { expiresIn: '24h' }
    )
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.JWT_SECRET

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {

        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false)
            }
            else if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))

exports.veriftUser = passport.authenticate('jwt', { session: false, failureFlash: "You are not authorized!" })

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    }
    else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json')
        res.json({ status: 'fail', message: 'You are not authorized to perform this operation!' })
    }
}