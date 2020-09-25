var User = require('../models/user')
var express = require('express')
var passport = require('passport')
var authenticate = require('../util/authenticate')
const errorMessage = require('../util/errorMessage')

const router = express.Router()

// custom error message
router.use(errorMessage.emulateFlash);

// get all users
router.get('/', (req, res, next) => {
    User.find({})
        .then(users => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: true,
                users: users
            })
        }).catch(err => next(err))
})


// sign up
router.post('/signup', (req, res, next) => {

    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json')
                res.json({ error: true, message: "User Already exist" })
            } else {
                User.register({ username: req.body.username }, req.body.password, (err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json')
                        res.json({ error: err })
                    } else {
                        passport.authenticate('local')(req, res, () => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json({ success: true, message: 'Registration Successfull!' })
                        })
                    }
                })
            }
        }).catch(err => next(err))

})

// log in
router.post('/login', passport.authenticate('local', { failureFlash: "Invalid email or password." }), (req, res, next) => {
    let token
    User.findOne({ username: req.body.username })
        .then(user => {
            token = authenticate.getToken(user)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json({ success: true, message: 'Login Successfull!', user: { username: user.username, token } })
        })
});



// handle specific user with id
router.route('/:id')
    .get((req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                if (user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, user: user })
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: 'user not found!' })
                }

            }).catch(err => next(err))
    })
    .post((req, res, next) => {
        res.send('POST operation not supported!')
    })
    .put((req, res, next) => {
        res.send('PUT operation not supported!')
    })
    .delete((req, res, next) => {
        User.findByIdAndDelete(req.params.id)
            .then(user => {
                if (user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, message: 'successfully deleted the user' })
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: 'user not found!' })
                }
            }).catch(err => next(err))
    })





module.exports = router;