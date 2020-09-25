const express = require('express')
const Order = require('../models/order')

const router = express.Router()

// all orders
router.route('/')
    .get((req, res, next) => {
        Order.find({})
            .then(orders => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    users: orders
                })
            }).catch(err => next(err))
    })
    .post((req, res, next) => {
        Order.findOne({ username: req.body.username })
            .then(product => {
                if (product) {
                    // push order to it
                    Order.updateOne({ username: req.body.username }, {
                        $push: {
                            orders: req.body.order
                        }
                    })
                        .then(order => {
                            if (order) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json')
                                res.json({ success: true, message: 'orders updated' })
                            } else {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json')
                                res.json({ error: true, message: 'can not update the order!' })
                            }
                        }).catch(err => next(err))
                } else {
                    // create new one
                    Order.create({
                        username: req.body.username,
                        orders: req.body.order
                    })
                        .then(order => {
                            if (order) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json')
                                res.json({ success: true, message: 'successfully created new order' })
                            } else {
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json')
                                res.json({ error: true, message: 'can not create new order!' })
                            }
                        }).catch(err => next(err))
                }
            }).catch(err => next(err))
    })
    .put((req, res, next) => {
        res.send("PUT operation is not supported!")
    })
    .delete((req, res, next) => {
        Order.deleteMany({})
            .then(message => {
                if (message) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, message: 'successfully deleted all orders' })
                } else {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: 'can not delete all orders!' })
                }
            }).catch(err => next(err))
    })



// order by username
router.route('/:username')
    .get((req, res, next) => {
        Order.findOne({ username: req.params.username })
            .then(order => {
                if (order) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, order: order })
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: 'order not found!' })
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
        Order.findOneAndDelete({username: req.params.username})
        .then(order => {
            if (order) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json({ success: true, message: 'successfully deleted the order' })
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json')
                res.json({ error: true, message: 'order not found!' })
            }
        }).catch(err => next(err))
    })


module.exports = router