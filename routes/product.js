const express = require('express')
const Product = require('../models/product')
const authenticate = require('../util/authenticate')
const errorMessage = require('../util/errorMessage')

const router = express.Router()

// custom error message
router.use(errorMessage.emulateFlash);

// All products
router.route('/')
    .get((req, res, next) => {
        Product.find({})
            .then(products => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    products: products
                })
            }).catch(err => next(err))
    })
    .post((req, res, next) => {
        const newProduct = new Product({
            name: req.body.name,
            image: req.body.image,
            company: req.body.company,
            price: req.body.price,
            description: req.body.description,
        })
        // first : search by name
        Product.findOne({ name: req.body.name })
            .then(product => {
                if (product) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: "product already exists!" })
                }
                // second : search by image
                else {
                    Product.findOne({ image: req.body.image })
                        .then(product => {
                            if (product) {
                                res.statusCode = 403;
                                res.setHeader('Content-Type', 'application/json')
                                res.json({ error: true, message: "product already exists!" })
                            } else {
                                newProduct.save()
                                    .then(() => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json')
                                        res.json({ success: true, message: "product created successfully" })
                                    }).catch(err => next(err))
                            }
                        })
                }
            }).catch(err => next(err))
    })
    .put((req, res, next) => {
        res.send("PUT operation is not supported!")
    })
    .delete( (req, res, next) => {
        Product.deleteMany({})
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json({ success: true, message: "All Products are successfully deleted" })
            }).catch(err => next(err))
    })


// By ID
router.route('/:id')
    .get((req, res, next) => {
        Product.findById(req.params.id)
            .then(product => {
                if (product) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, product: product })
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: 'product not found!' })
                }
            }).catch(err => next(err))
    })
    .post((req, res, next) => {
        res.send("POST operation is not supported!")
    })
    .put((req, res, next) => {
        Product.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                price: req.body.price,
                description: req.body.description
            }
        }).then((product) => {
            if (product) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json({ success: true, message: "product updated successfully" })
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json')
                res.json({ error: true, message: "product not found!" })
            }
        }).catch(err => next(err))

    })
    .delete((req, res, next) => {
        Product.findOneAndDelete({ _id: req.params.id })
            .then(message => {
                if (message) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, message: "product deleted successfully" })
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ error: true, message: "product not found!" })
                }
            }).catch(err => next(err))
    })




module.exports = router

